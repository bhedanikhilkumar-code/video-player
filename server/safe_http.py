"""Downloader egress policy. Every HTTP connection pins validated public DNS results.

The yt-dlp transport is deliberately restricted to this urllib handler. TLS still
uses the original hostname for SNI and certificate checks. Never monkeypatch the
process-wide socket resolver: Flask serves concurrent requests.
"""
import http.client
import ipaddress
import socket
import urllib.request
from urllib.parse import urlsplit

import yt_dlp
from yt_dlp.networking import _urllib as transport


class UnsafeDestination(ValueError):
    pass


def public_addresses(host, port):
    if port not in (80, 443):
        raise UnsafeDestination('Only standard web ports are allowed.')
    answers = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    if not answers:
        raise UnsafeDestination('No destination address.')
    for family, kind, proto, canon, address in answers:
        ip = ipaddress.ip_address(address[0])
        mapped = getattr(ip, 'ipv4_mapped', None)
        if (not ip.is_global or (mapped and not mapped.is_global)
                or getattr(ip, 'sixtofour', None) or getattr(ip, 'teredo', None)
                or (ip.version == 6 and ip in ipaddress.ip_network('64:ff9b::/96'))):
            raise UnsafeDestination('This destination is not allowed.')
    return answers


def validate_web_url(url):
    if not isinstance(url, str) or len(url) > 2000 or any(ord(c) < 33 for c in url):
        raise UnsafeDestination('Invalid web URL.')
    try:
        p = urlsplit(url)
        if p.scheme not in ('http', 'https') or not p.hostname or p.username is not None or p.password is not None:
            raise UnsafeDestination('Only credential-free HTTP/HTTPS URLs are allowed.')
        public_addresses(p.hostname, p.port or (443 if p.scheme == 'https' else 80))
    except (ValueError, OSError) as e:
        raise UnsafeDestination('Invalid or disallowed web destination.') from e
    return url


def connect_public(address, timeout=socket._GLOBAL_DEFAULT_TIMEOUT, source_address=None):
    # Resolve exactly once, validate ALL answers, and connect to the numeric sockaddr.
    # Never pass the hostname to create_connection, which would resolve it again.
    answers = public_addresses(*address)
    last = None
    for family, kind, proto, canon, sockaddr in answers:
        sock = socket.socket(family, kind, proto)
        try:
            if timeout is not socket._GLOBAL_DEFAULT_TIMEOUT:
                sock.settimeout(timeout)
            if source_address:
                sock.bind(source_address)
            sock.connect(sockaddr)
            return sock
        except OSError as e:
            last = e
            sock.close()
    raise last or UnsafeDestination('No destination address.')


class PublicHTTPHandler(transport.HTTPHandler):
    def _factory(self, cls, *args, **kwargs):
        conn = cls(*args, **kwargs)
        conn._create_connection = connect_public
        return conn

    def http_open(self, req):
        validate_web_url(req.full_url)
        return self.do_open(lambda *a, **k: self._factory(http.client.HTTPConnection, *a, **k), req)

    def https_open(self, req):
        validate_web_url(req.full_url)
        return self.do_open(lambda *a, **k: self._factory(http.client.HTTPSConnection, *a, **k), req, context=self._context)


class PublicUrllibRH(transport.UrllibRH):
    _SUPPORTED_URL_SCHEMES = ('http', 'https')
    RH_NAME = 'public-urllib'

    def _create_instance(self, proxies, cookiejar, legacy_ssl_support=None):
        # No environment proxy, file, FTP, data or fallback network handlers.
        opener = urllib.request.OpenerDirector()
        for handler in [urllib.request.ProxyHandler({}),
                        PublicHTTPHandler(context=self._make_sslcontext(legacy_ssl_support=legacy_ssl_support)),
                        transport.HTTPCookieProcessor(cookiejar), transport.UnknownHandler(),
                        transport.HTTPDefaultErrorHandler(), transport.HTTPErrorProcessor(), transport.RedirectHandler()]:
            opener.add_handler(handler)
        opener.addheaders = []
        return opener


class SafeYoutubeDL(yt_dlp.YoutubeDL):
    def build_request_director(self, handlers, preferences=None):
        return super().build_request_director([PublicUrllibRH])

    def process_info(self, info):
        # Force native HTTP downloads. Never let extractor-selected protocols launch
        # RTMP/RTSP or other external network clients outside the guarded transport.
        from yt_dlp.utils import determine_protocol
        allowed = {'http', 'https', 'm3u8', 'm3u8_native', 'http_dash_segments'}
        if info.get('is_live') or any(p not in allowed for p in determine_protocol(info).split('+')):
            raise UnsafeDestination('This media protocol is not supported safely.')
        return super().process_info(info)

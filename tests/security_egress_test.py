import io
import os
import sys
import unittest
from unittest.mock import patch, Mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))
import safe_http as net
import app as backend

PUBLIC = [(2, 1, 6, '', ('93.184.216.34', 443))]
PRIVATE = [(2, 1, 6, '', ('127.0.0.1', 443))]


class EgressTests(unittest.TestCase):
    def test_private_and_special_addresses(self):
        for ip in ['127.0.0.1', '10.0.0.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', '::ffff:127.0.0.1', '64:ff9b::7f00:1']:
            answers = [(10 if ':' in ip else 2, 1, 6, '', (ip, 443))]
            with self.subTest(ip=ip), patch.object(net.socket, 'getaddrinfo', return_value=answers):
                with self.assertRaises(net.UnsafeDestination): net.public_addresses('unit.invalid', 443)

    def test_mixed_dns_blocks_all_before_socket(self):
        with patch.object(net.socket, 'getaddrinfo', return_value=PUBLIC + PRIVATE), patch.object(net.socket, 'socket') as sock:
            with self.assertRaises(net.UnsafeDestination): net.connect_public(('unit.invalid', 443))
            sock.assert_not_called()

    def test_pins_numeric_address_without_second_dns(self):
        with patch.object(net.socket, 'getaddrinfo', side_effect=[PUBLIC, PRIVATE]) as dns, patch.object(net.socket, 'socket') as sock:
            net.connect_public(('unit.invalid', 443), 5)
            self.assertEqual(dns.call_count, 1)
            sock.return_value.connect.assert_called_once_with(PUBLIC[0][4])

    def test_rebinding_between_validation_and_connection(self):
        with patch.object(net.socket, 'getaddrinfo', side_effect=[PUBLIC, PRIVATE]), patch.object(net.socket, 'socket') as sock:
            net.validate_web_url('https://unit.invalid/')
            with self.assertRaises(net.UnsafeDestination): net.connect_public(('unit.invalid', 443))
            sock.assert_not_called()

    def test_input_policy(self):
        for u in ['file:///etc/passwd', 'ftp://unit.invalid/x', 'http://[', 'http://unit.invalid:99999/', 'https://x@y/', 'https://unit.invalid:22/', 'https://unit.invalid/\r\nx']:
            with self.subTest(url=u), self.assertRaises(net.UnsafeDestination): net.validate_web_url(u)

    def test_redirect_and_subrequest_rechecked_by_handler(self):
        handler = net.PublicHTTPHandler()
        with patch.object(net.socket, 'getaddrinfo', return_value=PRIVATE), patch.object(handler, 'do_open') as send:
            for target in ['http://internal.invalid/', 'https://internal.invalid/']:
                req = net.urllib.request.Request(target)
                with self.assertRaises(net.UnsafeDestination):
                    (handler.https_open if target.startswith('https') else handler.http_open)(req)
            send.assert_not_called()

    def test_no_unguarded_transport_fallback(self):
        with net.SafeYoutubeDL(backend.base_opts()) as y:
            handlers = list(y._request_director.handlers.values())
            self.assertEqual(len(handlers), 1)
            self.assertIsInstance(handlers[0], net.PublicUrllibRH)
            self.assertEqual(handlers[0]._SUPPORTED_URL_SCHEMES, ('http', 'https'))
            with self.assertRaises(net.UnsafeDestination): y.process_info({'url': 'rtmp://unit.invalid/x', 'protocol': 'rtmp'})

    def test_ffmpeg_has_no_network_protocols_and_no_remote_ranges(self):
        opts = backend.base_opts()
        self.assertEqual(opts['external_downloader'], 'native')
        from yt_dlp.downloader.external import FFmpegFD
        from yt_dlp.postprocessor import ffmpeg as module
        with net.SafeYoutubeDL(opts) as y:
            self.assertEqual(FFmpegFD(y, y.params)._configuration_args(('_i1', '_i')), ['-protocol_whitelist', 'file,crypto,data'])
            for cls in vars(module).values():
                if isinstance(cls, type) and issubclass(cls, module.FFmpegPostProcessor):
                    processor = cls(y)
                    self.assertEqual(processor._configuration_args('ffmpeg', ['_i1', '_i']), ['-protocol_whitelist', 'file,crypto,data'], cls.__name__)
        self.assertNotIn('download_ranges', opts)

    def test_real_urllib_stack_success_and_private_redirect(self):
        from yt_dlp.networking import Request
        class FakeSocket:
            def __init__(self, reply): self.reply = reply
            def settimeout(self, value): pass
            def connect(self, address): pass
            def setsockopt(self, *args): pass
            def sendall(self, data): pass
            def makefile(self, *args, **kwargs): return io.BytesIO(self.reply)
            def close(self): pass
        reply = b'HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nok'
        with patch.object(net.socket, 'getaddrinfo', return_value=PUBLIC), patch.object(net.socket, 'socket', return_value=FakeSocket(reply)):
            with net.SafeYoutubeDL(backend.base_opts()) as y:
                with y.urlopen(Request('http://unit.invalid/')) as r:
                    self.assertEqual(r.read(), b'ok')
        redirect = b'HTTP/1.1 302 Found\r\nLocation: http://blocked.invalid/\r\nContent-Length: 0\r\n\r\n'
        def resolve(host, *args, **kwargs): return PRIVATE if host == 'blocked.invalid' else PUBLIC
        with patch.object(net.socket, 'getaddrinfo', side_effect=resolve), patch.object(net.socket, 'socket', return_value=FakeSocket(redirect)) as connect:
            with net.SafeYoutubeDL(backend.base_opts()) as y:
                with self.assertRaises(Exception): y.urlopen(Request('http://unit.invalid/'))
            self.assertEqual(connect.call_count, 1, 'redirect must be denied before opening another socket')

    def test_times_are_finite_and_bounded(self):
        for v in ['NaN', 'inf', '-1', str(backend.MAX_SECONDS + 1)]:
            with self.assertRaises(backend.Bad): backend.sec(v)
        self.assertEqual(backend.sec('12.5'), 12.5)


if __name__ == '__main__': unittest.main()

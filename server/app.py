import os, re, uuid, time, threading, shutil, socket, ipaddress, tempfile
from urllib.parse import urlparse
from flask import Flask, request, jsonify, send_file, abort
import yt_dlp

ALLOWED_ORIGINS = {"https://video-player-eta-one.vercel.app", "http://localhost:8000", "http://127.0.0.1:8000"}
YT_HOSTS = ("youtube.com", "youtu.be", "youtube-nocookie.com", "youtubekids.com", "yt.be")
WORK = os.path.join(tempfile.gettempdir(), "vp-tasks")
os.makedirs(WORK, exist_ok=True)
MAX_TASKS = 3          # concurrent running tasks (512 MB host)
TTL = 15 * 60          # files/tasks live 15 min
MAX_SECONDS = 3 * 3600 # refuse very long media
TASKS = {}
LOCK = threading.Lock()
app = Flask(__name__)

@app.after_request
def cors(r):
    o = request.headers.get("Origin", "")
    if o in ALLOWED_ORIGINS:
        r.headers["Access-Control-Allow-Origin"] = o
        r.headers["Vary"] = "Origin"
        r.headers["Access-Control-Allow-Headers"] = "Content-Type"
        r.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return r

@app.route("/<path:p>", methods=["OPTIONS"])
def pre(p): return ("", 204)

class Bad(Exception):
    def __init__(s, code, msg): s.code, s.msg = code, msg

def is_yt(host):
    host = (host or "").lower().rstrip(".")
    return any(host == h or host.endswith("." + h) for h in YT_HOSTS)

def check_url(u):
    if not isinstance(u, str) or len(u) > 2000: raise Bad("bad_url", "Invalid link.")
    p = urlparse(u.strip())
    if p.scheme not in ("http", "https") or not p.hostname: raise Bad("bad_url", "Only http/https links are supported.")
    if is_yt(p.hostname): raise Bad("youtube_blocked", "YouTube links can't be downloaded. Play them in the player.")
    try:
        for ai in socket.getaddrinfo(p.hostname, None):
            ip = ipaddress.ip_address(ai[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
                raise Bad("bad_url", "This address is not allowed.")
    except socket.gaierror:
        raise Bad("bad_url", "Could not find that site's address.")
    return u.strip()

def base_opts():
    return {"quiet": True, "no_warnings": True, "noplaylist": True, "socket_timeout": 20,
            "allowed_extractors": ["default", "-generic", "-youtube.*"], "retries": 2}

def classify(f):
    v, a = f.get("vcodec") not in (None, "none"), f.get("acodec") not in (None, "none")
    return "video+audio" if v and a else "video" if v else "audio" if a else "other"

def do_info(url):
    with yt_dlp.YoutubeDL(base_opts()) as y:
        i = y.extract_info(url, download=False)
    if (i.get("extractor_key") or "").lower().startswith("youtube"): raise Bad("youtube_blocked", "YouTube blocked.")
    if i.get("_type") == "playlist" and i.get("entries"):
        i = next(e for e in i["entries"] if e)
    if (i.get("duration") or 0) > MAX_SECONDS: raise Bad("too_long", "The video is too long.")
    fmts = []
    for f in i.get("formats") or []:
        if f.get("protocol") in ("mhtml",) or not f.get("format_id"): continue
        fmts.append({"id": f["format_id"], "ext": f.get("ext"), "kind": classify(f), "height": f.get("height"),
                     "width": f.get("width"), "fps": f.get("fps"), "abr": f.get("abr"), "tbr": f.get("tbr"),
                     "vcodec": f.get("vcodec"), "acodec": f.get("acodec"),
                     "size": f.get("filesize") or f.get("filesize_approx"), "note": f.get("format_note"),
                     "protocol": f.get("protocol")})
    subs = {k: [{"ext": s.get("ext"), "url": s.get("url")} for s in v if s.get("url")] for k, v in (i.get("subtitles") or {}).items()}
    return {"title": i.get("title"), "duration": i.get("duration"), "thumbnail": i.get("thumbnail"),
            "uploader": i.get("uploader"), "site": i.get("extractor_key"), "webpage_url": i.get("webpage_url"),
            "formats": fmts, "subtitles": subs}

def sec(x):
    if x in (None, ""): return None
    x = float(x)
    if x < 0: raise Bad("bad_range", "Invalid time.")
    return x

def do_download(t, p):
    url = p["url"]; kind = p.get("kind", "video")  # video | mp3
    fid = p.get("format")
    if fid is not None and not re.fullmatch(r"[A-Za-z0-9_\-\.\+]{1,60}", str(fid)): raise Bad("bad_format", "Invalid format.")
    start, end = sec(p.get("from")), sec(p.get("to"))
    if start is not None and end is not None and end <= start: raise Bad("bad_range", "'To' must be later than 'From'.")
    d = os.path.join(WORK, t["id"]); os.makedirs(d)
    t["dir"] = d
    o = base_opts()
    o["outtmpl"] = os.path.join(d, "out.%(ext)s")
    o["merge_output_format"] = "mp4"
    o["max_filesize"] = 400 * 1024 * 1024
    def hook(h):
        if h["status"] == "downloading":
            tot = h.get("total_bytes") or h.get("total_bytes_estimate") or 0
            if tot: t["progress"] = min(90, int(h["downloaded_bytes"] * 90 / tot))
    o["progress_hooks"] = [hook]
    pp = []
    if kind == "mp3":
        o["format"] = fid or "bestaudio/best"
        pp.append({"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "192"})
    else:
        if fid and (p.get("mux") or "+" in str(fid)): o["format"] = str(fid)
        elif fid: o["format"] = f"{fid}+bestaudio/{fid}/best"
        else: o["format"] = "bv*+ba/b"
    if start is not None or end is not None:
        from yt_dlp.utils import download_range_func
        o["download_ranges"] = download_range_func([], [(start or 0, end or 10**6)])
        o["force_keyframes_at_cuts"] = True
    if pp: o["postprocessors"] = pp
    with yt_dlp.YoutubeDL(o) as y:
        i = y.extract_info(url, download=True)
    if (i.get("extractor_key") or "").lower().startswith("youtube"): raise Bad("youtube_blocked", "YouTube blocked.")
    files = [f for f in os.listdir(d) if f.startswith("out.")]
    if not files: raise Bad("no_file", "The file could not be created.")
    f = files[0]
    title = re.sub(r"[^\w\-. ]+", "", i.get("title") or "video").strip()[:80] or "video"
    t["file"] = f; t["name"] = f"{title}.{f.rsplit('.',1)[-1]}"

def run(t, fn, p):
    try:
        t["status"] = "running"
        if t["type"] == "info": t["result"] = do_info(p["url"])
        else: do_download(t, p)
        t["progress"] = 100; t["status"] = "done"
    except Bad as e: t["status"], t["error"] = "error", {"code": e.code, "message": e.msg}
    except Exception as e:
        m = str(e)
        code = "extract_failed"
        if re.search(r"429|403|sign in|login|blocked|Forbidden|bot", m, re.I): code = "site_blocked"
        if "Unsupported URL" in m or "allowed" in m: code = "unsupported"
        t["status"], t["error"] = "error", {"code": code, "message": re.sub(r"\x1b\[[0-9;]*m", "", m)[:300]}

def cleanup():
    while True:
        time.sleep(60)
        now = time.time()
        with LOCK:
            for k in [k for k, v in TASKS.items() if now - v["created"] > TTL]:
                d = TASKS.pop(k).get("dir")
                if d: shutil.rmtree(d, ignore_errors=True)
threading.Thread(target=cleanup, daemon=True).start()


PLAYLIST_ID = re.compile(r"^[A-Za-z0-9_-]{5,80}$")

def playlist_flat(pid):
    """Full playlist listing via yt-dlp flat extraction. Reads metadata only, downloads nothing."""
    o = {"quiet": True, "no_warnings": True, "extract_flat": True, "socket_timeout": 20, "retries": 1}
    with yt_dlp.YoutubeDL(o) as y:
        i = y.extract_info("https://www.youtube.com/playlist?list=" + pid, download=False)
    vids = []
    for e in (i.get("entries") or []):
        if e and e.get("id"):
            vids.append({"id": e.get("id"), "title": e.get("title") or ""})
        if len(vids) >= 200:
            break
    return i.get("title") or "", vids

def playlist_feed(pid):
    """Fallback: YouTube's public Atom feed for the playlist (15 newest videos)."""
    import urllib.request, xml.etree.ElementTree as ET
    req = urllib.request.Request(
        "https://www.youtube.com/feeds/videos.xml?playlist_id=" + pid,
        headers={"User-Agent": "Mozilla/5.0 (playlist reader)"})
    with urllib.request.urlopen(req, timeout=15) as r:
        root = ET.fromstring(r.read(2000000))
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    vids = []
    for e in root.findall("a:entry", ns):
        vid = e.findtext("yt:videoId", default="", namespaces=ns)
        if vid and re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
            vids.append({"id": vid, "title": e.findtext("a:title", default="", namespaces=ns) or ""})
    return root.findtext("a:title", default="", namespaces=ns) or "", vids

@app.get("/playlist")
def playlist():
    pid = request.args.get("id", "")
    if not PLAYLIST_ID.fullmatch(pid or ""):
        return jsonify(error={"code": "bad_id", "message": "That playlist link doesn't look right."}), 400
    err = None
    try:
        title, vids = playlist_flat(pid)
        if vids:
            return {"title": title, "videos": vids, "partial": False}
    except Exception as e:
        err = re.sub(r"\x1b\[[0-9;]*m", "", str(e))[:300]
    try:
        title, vids = playlist_feed(pid)
        if vids:
            return {"title": title, "videos": vids, "partial": True}
        err = err or "No videos found in that playlist."
    except Exception as e:
        err = err or re.sub(r"\x1b\[[0-9;]*m", "", str(e))[:300]
    code = "site_blocked" if err and re.search(r"429|403|sign in|bot|Forbidden", err, re.I) else "extract_failed"
    return jsonify(error={"code": code, "message": err or "Could not read that playlist."}), 400


WATCH_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                 "Accept-Language": "en-US,en;q=0.9", "Cookie": "SOCS=CAI"}
CH_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
CH_CACHE = {}

def _ts_sec(s):
    try:
        sec = 0
        for x in s.strip().split(":"):
            sec = sec * 60 + int(x)
        return sec
    except (ValueError, AttributeError):
        return None

def _walk_markers(o, out):
    if isinstance(o, dict):
        r = o.get("macroMarkersListItemRenderer")
        if isinstance(r, dict):
            t = ((r.get("title") or {}).get("simpleText") or "").strip()
            tm = ((r.get("timeDescription") or {}).get("simpleText") or "").strip()
            sec = _ts_sec(tm) if tm else None
            if t and sec is not None:
                out.append({"t": sec, "label": t[:120]})
        for v in o.values():
            _walk_markers(v, out)
    elif isinstance(o, list):
        for v in o:
            _walk_markers(v, out)

def _extract_initial_data(html):
    i = html.find("ytInitialData")
    if i < 0:
        return None
    j = html.find("{", i)
    if j < 0:
        return None
    depth = 0
    instr = False
    esc = False
    for k in range(j, min(j + 8000000, len(html))):
        c = html[k]
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
        else:
            if c == '"':
                instr = True
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    import json as _json
                    try:
                        return _json.loads(html[j:k + 1])
                    except Exception:
                        return None
    return None

def fetch_chapters(vid):
    import urllib.request
    req = urllib.request.Request("https://www.youtube.com/watch?v=" + vid + "&hl=en&gl=US", headers=WATCH_HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        html = r.read(4000000).decode("utf-8", "replace")
    chs = []
    data = _extract_initial_data(html)
    if data:
        _walk_markers(data, chs)
    if not chs:
        # Fallback: timestamp lines inside the description preview text.
        m = re.search(r'"attributedDescription":\{"content":"((?:[^"\\]|\\.)*)"', html)
        if m:
            try:
                import json as _json
                desc = _json.loads('"' + m.group(1) + '"')
            except Exception:
                desc = ""
            for line in desc.split("\n"):
                mm = re.match(r"^\s*(\d{1,2}(?::\d{1,2}){1,2})\s+(.{2,120}?)\s*$", line)
                if mm:
                    sec = _ts_sec(mm.group(1))
                    if sec is not None:
                        chs.append({"t": sec, "label": mm.group(2).strip()[:120]})
    seen = set()
    out = []
    for c in sorted(chs, key=lambda x: x["t"]):
        if c["t"] in seen:
            continue
        seen.add(c["t"])
        out.append(c)
    return out[:100]

@app.get("/chapters")
def chapters():
    vid = request.args.get("id", "")
    if not CH_ID.fullmatch(vid or ""):
        return jsonify(error={"code": "bad_id", "message": "That video id doesn't look right."}), 400
    now = time.time()
    with LOCK:
        hit = CH_CACHE.get(vid)
        if hit and now - hit[0] < 600:
            return hit[1]
    try:
        data = {"chapters": fetch_chapters(vid)}
    except Exception as e:
        err = re.sub(r"\x1b\[[0-9;]*m", "", str(e))[:200]
        code = "site_blocked" if re.search(r"429|403|sign in|bot|Forbidden", err, re.I) else "extract_failed"
        return jsonify(error={"code": code, "message": err or "Could not read chapters."}), 400
    with LOCK:
        if len(CH_CACHE) > 200:
            CH_CACHE.clear()
        CH_CACHE[vid] = (now, data)
    return data


@app.get("/health")
def health(): return {"ok": True, "yt_dlp": yt_dlp.version.__version__, "ffmpeg": bool(shutil.which("ffmpeg"))}

@app.post("/tasks")
def create():
    b = request.get_json(silent=True) or {}
    try:
        typ = b.get("type")
        if typ not in ("info", "download"): raise Bad("bad_type", "type must be info or download.")
        b["url"] = check_url(b.get("url"))
        with LOCK:
            if sum(1 for v in TASKS.values() if v["status"] in ("queued", "running")) >= MAX_TASKS:
                raise Bad("busy", "Server is busy, try again shortly.")
            t = {"id": uuid.uuid4().hex[:12], "type": typ, "status": "queued", "progress": 0, "created": time.time()}
            TASKS[t["id"]] = t
    except Bad as e:
        return jsonify(error={"code": e.code, "message": e.msg}), 400
    threading.Thread(target=run, args=(t, None, b), daemon=True).start()
    return {"id": t["id"]}

@app.get("/tasks/<tid>")
def status(tid):
    t = TASKS.get(tid) or abort(404)
    out = {k: t.get(k) for k in ("id", "type", "status", "progress", "result", "error", "name")}
    if t["status"] == "done" and t.get("file"): out["file"] = f"/files/{tid}"
    return out

@app.get("/files/<tid>")
def files(tid):
    t = TASKS.get(tid) or abort(404)
    if t["status"] != "done" or not t.get("file"): abort(404)
    return send_file(os.path.join(t["dir"], t["file"]), as_attachment=True, download_name=t["name"])

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
    if not isinstance(u, str) or len(u) > 2000: raise Bad("bad_url", "Link sahi nahi hai.")
    p = urlparse(u.strip())
    if p.scheme not in ("http", "https") or not p.hostname: raise Bad("bad_url", "Sirf http/https link chalta hai.")
    if is_yt(p.hostname): raise Bad("youtube_blocked", "YouTube links download nahi hote. Player me play kar sakte ho.")
    try:
        for ai in socket.getaddrinfo(p.hostname, None):
            ip = ipaddress.ip_address(ai[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
                raise Bad("bad_url", "Ye address allowed nahi hai.")
    except socket.gaierror:
        raise Bad("bad_url", "Site ka address nahi mila.")
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
    if (i.get("duration") or 0) > MAX_SECONDS: raise Bad("too_long", "Video bahut lamba hai.")
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
    if x < 0: raise Bad("bad_range", "Time galat hai.")
    return x

def do_download(t, p):
    url = p["url"]; kind = p.get("kind", "video")  # video | mp3
    fid = p.get("format")
    if fid is not None and not re.fullmatch(r"[A-Za-z0-9_\-\.\+]{1,60}", str(fid)): raise Bad("bad_format", "Format galat hai.")
    start, end = sec(p.get("from")), sec(p.get("to"))
    if start is not None and end is not None and end <= start: raise Bad("bad_range", "'To' 'From' se bada hona chahiye.")
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
        if fid and "+" in str(fid): o["format"] = str(fid)
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
    if not files: raise Bad("no_file", "File ban nahi payi.")
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

@app.get("/health")
def health(): return {"ok": True, "yt_dlp": yt_dlp.version.__version__, "ffmpeg": bool(shutil.which("ffmpeg"))}

@app.post("/tasks")
def create():
    b = request.get_json(silent=True) or {}
    try:
        typ = b.get("type")
        if typ not in ("info", "download"): raise Bad("bad_type", "type info ya download hona chahiye.")
        b["url"] = check_url(b.get("url"))
        with LOCK:
            if sum(1 for v in TASKS.values() if v["status"] in ("queued", "running")) >= MAX_TASKS:
                raise Bad("busy", "Server busy hai, thodi der baad try karo.")
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

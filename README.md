# Video player + downloader

Single-page app (`index.html`, vanilla JS) hosted on Vercel. Commits to `main` deploy automatically.

## What it does
- Plays YouTube links (embed only) with queue, history, favourites, A-B loop, sleep timer, keyboard shortcuts, themes.
- Downloader for NON-YouTube sites (info, quality picker, merge, MP3, trim, subtitles) using the backend in `server/`.
- Local player with volume boost (up to 300%) and speed presets.

## Rules
- No YouTube downloading, in the app or the backend (blocked in both).
- The app adds no ads of its own.

## Backend (`server/`)
Flask + yt-dlp + ffmpeg in Docker, on Render free tier (512 MB, sleeps after 15 min idle, about 1 minute cold start).
Endpoints: `GET /health`, `POST /tasks` (type `info` or `download`), `GET /tasks/<id>`, `GET /files/<id>`.
CORS allows only the Vercel site and localhost. Private addresses are refused. Files are deleted after 15 minutes.
Some sites (Vimeo, Facebook, archive.org) block datacenter IPs, so they can fail on the free host.
To redeploy: commit to `server/`; Render rebuilds. Keep yt-dlp updated by redeploying (it installs the latest).

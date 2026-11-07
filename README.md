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


## Keep-alive
A free cron-job.org job calls `https://vp-downloader.onrender.com/health` every 10 minutes, from 00:00 to 18:59 UTC (about 05:30 to 00:29 IST), so the free Render server stays awake while the app is in use. It sleeps overnight on purpose: Render gives 750 free instance hours per workspace per month, shared by all free services, and 24/7 uptime would use almost all of them.
To change it, sign in to cron-job.org (login is in the vault as "cron-job.org (agent)") and edit the job "vp-downloader keep-alive". Cron expression: `*/10 0-18 * * *` (UTC).

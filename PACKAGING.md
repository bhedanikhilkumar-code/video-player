# Video Player static distribution

This package contains the browser app, not a Node.js player library, desktop installer or downloader server.

## Run the zip

1. Extract the complete zip.
2. Open a terminal in its `video-player` folder.
3. Run `python3 -m http.server 8080` (on Windows, `py -m http.server 8080`).
4. Visit `http://localhost:8080` in a browser.

Python is only a convenient local web server, not an app dependency. Any static web server works. Serve the app at the site's root because its manifest and service worker use root-relative paths. Opening `index.html` directly with `file://` is not the supported setup. Use HTTPS for non-local hosting and PWA features.

## Install from GitHub Packages

GitHub's npm registry requires authentication even for public packages. Configure your own GitHub personal access token (classic), with `read:packages`, using npm's login flow. Never paste it into this repository or a chat.

```sh
npm login --scope=@bhedanikhilkumar-code --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @bhedanikhilkumar-code/video-player --registry=https://npm.pkg.github.com
```

The static files will be in `node_modules/@bhedanikhilkumar-code/video-player`. Serve that folder as a web root. There is no JavaScript import API, executable CLI, install script or runtime npm dependency. Downloading the release zip does not require npm authentication when the release is public.

## What is and is not included

- Includes HTML, app icons, PWA manifest, service worker and any static hosting headers present at build time.
- Excludes backend code, tests, development scripts, source history and credentials.
- `BUILD-INFO.json` identifies the exact source commit. The zip and npm package use the same staged app files.
- No license grant is added by packaging. The source currently has no license file; the npm metadata says `UNLICENSED` rather than claiming an open-source license.
- Online YouTube playback uses the official embedded player and requires internet. YouTube may show its own ads. No YouTube downloading or promise of background playback.
- The existing remote downloader endpoint is configured in the app. It is not bundled here and may sleep or reject a locally hosted origin under its CORS policy. Hosting this zip does not provide your own downloader backend.
- Library, history and settings are browser-local and origin-specific. Export a backup before changing origins. Browser media/PWA/notification support varies.
- This is a web app, not an APK, Windows EXE or native mobile app. Online videos are not bundled for offline viewing.

## Build and publish (maintainer)

Run `npm run build:package` from the repository root. The build uses an explicit static-file allowlist and scans for common credential patterns. It is not a full security audit.

The manual `Package and release` workflow publishes from `dist/video-player` using the repository's automatic `GITHUB_TOKEN` with `packages: write`. It creates a versioned zip and checksums in a GitHub Release. It does not use a stored personal token. Bump `package.json` before publishing another version; never replace a published version with different content.

Live app: https://vp-player.pages.dev
Repository: https://github.com/bhedanikhilkumar-code/video-player

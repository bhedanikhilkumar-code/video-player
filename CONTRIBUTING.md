# Contributing to HD Video Player

Thanks for helping improve the player. Small bug fixes, accessibility improvements, translations, tests and clear documentation are welcome. Read the [README](README.md) for the app's capabilities and limits, and [SECURITY.md](SECURITY.md) before reporting a possible vulnerability.

## Start with the right kind of contribution

- For a reproducible, non-security bug, search existing GitHub Issues before opening a new one.
- For a large feature, dependency, storage-format change or architecture change, open an issue first so the maintainer can discuss the approach before you spend time on it.
- For a small fix or documentation correction, a focused pull request is fine.
- Keep discussion respectful. Explain the problem and trade-offs, not the person. Do not post someone else's private data.

These are contribution guidelines, not a claim that automated checks, branch protection or a formal review team are configured.

## Project boundaries

Changes must preserve these rules:

- **No app-added ads**, tracking-based advertising or ad-blocking promises. YouTube can show its own ads.
- **Use the official YouTube player.** Do not add YouTube downloads, stream extraction, Premium bypasses, or screen-off/background/audio-only YouTube playback workarounds. Do not route YouTube through the downloader.
- **Free hosting and tools only.** Do not introduce a paid service, API key requirement, recurring charge or quota-consuming integration without discussing it first. A free trial is not a permanent free tier.
- **Keep local media local.** Ordinary device-video playback, subtitles and scene analysis must not upload the user's files. Remote download jobs are a separate backend feature.
- **Protect browser data.** Do not silently clear, replace or migrate libraries/settings. Validate imports, handle corrupt or unavailable storage, and preserve backup compatibility where possible.
- **Keep claims honest.** A desktop browser at a phone-sized viewport is not a real-device test. A successful push or health check is not proof that deployment or a download works.

## Repository map

| Path | What lives here |
| --- | --- |
| `index.html` | Static app, styles, vanilla JavaScript, UI text and translation tables. Much of the app is in closures inside inline scripts. |
| `sw.js` | Service worker, app-shell caching and offline/repair behavior. |
| `manifest.webmanifest`, root icons | PWA metadata and icons. |
| `_headers` | Frontend hosting headers, including security and cache rules. |
| `server/app.py` | Flask API and yt-dlp download jobs. |
| `server/requirements.txt`, `server/Dockerfile` | Backend dependencies and Python/ffmpeg container. |
| `tests/` | Focused Node source regressions, browser checks, fixtures and helper harnesses. |
| `assets/` | README artwork, screenshots and demo media. |
| `package.json`, `scripts/package-static.mjs`, `PACKAGING.md` | Static distribution packaging. This is not a frontend framework build. |
| `.github/workflows/package-release.yml` | Manual package/release workflow; read its inputs before running it. |

## Set up a local checkout

Fork the repository on GitHub, then clone your fork:

```sh
git clone https://github.com/YOUR-USERNAME/video-player.git
cd video-player
git remote add upstream https://github.com/bhedanikhilkumar-code/video-player.git
git switch -c fix/short-description
```

Use a current supported Node.js LTS for the Node checks and Python 3 for the static server. The backend Dockerfile uses Python 3.12. The frontend needs no dependency installation or build step to run.

### Frontend

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Do not use `file://` for PWA testing. YouTube and remote downloads still need the network. Browser APIs and codecs vary by browser and operating system.

The downloader points at the hosted API by default. Search `index.html` for `vp-downloader.onrender.com` when testing against a local backend. Keep any local API URL override out of your final commit. The backend's CORS allowlist includes `http://localhost:8000` and `http://127.0.0.1:8000`; another frontend port needs a deliberate local configuration change.

Use an isolated browser profile for tests. Export a backup before testing imports, resets or storage migrations against a profile you care about. Service workers can serve older files: check the actual loaded version before diagnosing a cache issue, and never recommend clearing user data without a backup warning.

### Optional downloader backend

With Docker installed:

```sh
docker build -t vp-downloader ./server
docker run --rm -p 10000:10000 vp-downloader
```

The API listens on port 10000 by default. `GET http://localhost:10000/health` checks that instance, not the public deployment. The container includes ffmpeg. Test with small media you own or have permission to download, never by loading the public service or attempting prohibited downloads.

## Testing: use the checks that actually exist

Run commands from the repository root. There is no single all-tests command promised by this guide. The test filenames describe focused historical regressions, not a complete release certification.

### Node source regressions

These examples use Node's built-in modules and need no npm install:

```sh
node tests/security-headers.test.cjs
node tests/round373-trcoverage.test.cjs
node tests/round468-tr-names.test.cjs
```

Run additional `tests/*.test.cjs` files relevant to the code you changed. Read each test first: some assert historical markup, script counts or exact source strings and may need an explained update after an intentional change. Do not delete a failing assertion just to get green output. Record any pre-existing failure separately from a new regression.

### Browser regressions

`tests/*.browser.cjs` are executable Node scripts, not a Playwright Test suite. Inspect the chosen test and its required harness first. For example, `round547-ui.browser.cjs` uses `round538-harness.cjs`, which:

- requires the `playwright` module and a Chrome executable at `/usr/bin/google-chrome`;
- starts a local server on port 8538 unless `VP_TEST_ORIGIN` is supplied;
- blocks external requests and uses a fresh browser context, so it does not prove real YouTube/network behavior;
- creates its own audio fixture through `round543-fixture.cjs`.

One way to install browser tooling without changing the project's package metadata is:

```sh
npm install --prefix ../vp-test-tools playwright
NODE_PATH="$(cd ../vp-test-tools/node_modules && pwd)" node tests/round547-ui.browser.cjs
```

This example assumes the Chrome path above exists. Installing Playwright alone does not satisfy that hard-coded path. Adapt your local test harness or environment if needed, and explain any harness changes in the PR. Other tests may need ffmpeg, a specific fixture, a different port or writable screenshot paths such as `/downloads`; inspect them rather than assuming one setup runs everything. Run browser tests sequentially when they share a port or fixture path.

### Manual checks for UI changes

Check both a narrow phone-sized viewport and desktop, keyboard navigation, visible focus, readable contrast and reduced-motion behavior. Exercise the changed control, empty/error states, reload persistence and cross-tab updates when relevant. Check the local-media and YouTube paths separately: a tool that works on a device file may not work inside the YouTube iframe. For PWA changes, check both a fresh load and an existing installation/cache. State which browsers and real devices, if any, you tested.

## Code and data conventions

There is no repository-wide formatter or linter policy enforced by this document. Match the surrounding code and keep diffs focused.

- Keep vanilla JavaScript, HTML and CSS consistent with nearby code. Do not reformat the large `index.html` as part of an unrelated fix.
- Check closure scope and initialization order before adding a listener or helper. A function inside another closure is not automatically available to the main app.
- Prefer existing helpers and event patterns. Avoid duplicate IDs, repeated global listeners, new polling loops and unnecessary globals.
- Use semantic controls, accessible names and keyboard support. Keep visible labels and `aria-*` text in sync.
- Treat URLs, imported files, subtitles, metadata and stored JSON as untrusted input. Use text-safe DOM updates for user text, validate bounds/types, and avoid introducing HTML/script injection.
- Do not weaken URL/redirect validation, request limits, security headers or the YouTube rejection rules to make a test pass. CORS is not authentication.
- Catch expected storage/API failures with useful feedback. Do not hide a new failure behind an empty catch without understanding its effect.
- Coordinate service-worker cache changes with the existing update strategy. Avoid stale offline assets and accidental loss of user data.
- Never commit credentials, tokens, personal media, browser profiles, downloaded output, `node_modules`, or generated package archives. Review `git diff` and `git status` before committing.

## English, Hindi and Gujarati

English is the default and must stay the default. The header cycles English, Hindi and Gujarati and remembers the user's choice.

- Reuse `T(...)`, `TR_MSG` and the relevant local translation/repaint helpers already used by the component.
- Global `TR_MSG` entries use an English key with `[Hindi, Gujarati]` values. Do not reverse that order or silently replace an existing shared translation.
- Translate labels, hints, errors, placeholders, tooltips, accessible names and dynamic messages, including Feature Finder and What's new entries when added.
- Repaint text when language changes without resetting selections, starting playback or losing focus. Language updates can be asynchronous: `tests/language-tap.cjs` waits for `#langBtn` to finish its `aria-busy` work; a changed `<html lang>` alone is not completion.
- Check all three languages at narrow widths. Keep technical identifiers and imported user text intact. Ask for language review where uncertain rather than claiming a translation was verified by a native speaker.
- Run the translation coverage/name checks above and add a focused regression for new dynamic labels.

## Branches, commits and pull requests

For new contributions, use a short descriptive branch such as `fix/subtitle-focus`, `feat/library-filter` or `docs/local-setup`. These names and the commit prefixes below are recommended conventions, not existing server-enforced rules.

Keep one logical change per commit. Use an imperative subject with a useful prefix, for example `fix: preserve subtitle focus after import`, `i18n: translate new queue labels` or `docs: explain local backend setup`. Commit as yourself; do not impersonate the maintainer or rewrite other contributors' authorship.

Before opening or updating a PR, fetch the current upstream `main` and bring your branch up to date. Resolve conflicts locally and rerun the affected checks. Do not force-push shared `main`, move existing tags or publish releases as part of an ordinary contribution.

Use this PR outline:

```text
Problem / linked issue:
What changed and why:
Tests run, commands and results:
Manual browser / viewport / device checks:
Screenshots for visual changes:
English / Hindi / Gujarati checks:
Storage, security, network or compatibility impact:
Known limits / follow-up work:
```

The maintainer decides whether and when to merge. Expect requests for a smaller diff, tests or corrections. Do not assume a review deadline, automatic merge, bounty, release number or deployment date. A merged frontend change still needs a successful Cloudflare deployment; backend changes need a separate Render deployment. See [PACKAGING.md](PACKAGING.md) for distribution packaging rather than treating a package publish as a website deploy.

## Report a non-security bug

Use GitHub Issues and include:

- a short title and minimal reproduction steps;
- expected behavior and actual behavior;
- browser/OS versions, app URL, approximate time, selected language and whether it is an installed PWA;
- source type: YouTube, device file or supported non-YouTube download; for local media, container/codec details if known;
- a redacted screenshot or console error, plus whether it reproduces after a normal reload or in a fresh test profile.

Remove tokens, private URLs, personal library/backup contents and identifying metadata. Do not attach copyrighted or private media; use a small permitted sample if one is needed. For a possible security issue, stop here and follow [SECURITY.md](SECURITY.md) instead of publishing exploit details.

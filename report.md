# Security review and fixed findings

Date: 18 November 2026 (IST)

## Scope and method

Reviewed the owner's video-player repository, the deployed frontend at https://vp-player.pages.dev/, and its downloader at https://vp-downloader.onrender.com/.

Used free tools: source review, Bandit, pip-audit, detect-secrets, targeted Git-history pattern checks, Node regression tests, Python unittest, and a locally generated FFmpeg media fixture. Live checks were a small number of spaced requests to the owner's endpoints, with no successful media jobs started. Rate-limit and concurrency tests ran locally with mocked work, not against the free server.

No load testing, brute force, denial-of-service test, private-network probing, or testing of YouTube, hosting infrastructure or other third-party services was performed. Ordinary repository/deployment access and advisory lookup were not security tests of those services.

This public report describes fixed findings only. It is a bounded review, not a security certification or a claim that all possible vulnerabilities have been found.

## Fixed findings

### 1. Downloader destination checks stopped at the submitted URL

- Where: `server/app.py`, new `server/safe_http.py`, `server/Dockerfile`.
- Root cause: the original URL was checked before extraction, but extractor subrequests, redirects and a later DNS lookup did not share a connection-level destination policy. An initial check alone cannot secure those later requests.
- Fix: use a single guarded HTTP/HTTPS transport for yt-dlp; validate every HTTP request and every connection; reject non-global and special-use destinations, credentials and nonstandard ports; validate all DNS answers and connect directly to a validated numeric address without a second DNS lookup. Preserve the original TLS hostname for certificate verification. Remove proxy/alternate-transport fallback and reject unsupported media protocols and live streams.
- FFmpeg boundary: force native downloads, apply a local-protocol whitelist to downloader inputs and **every** FFmpeg postprocessor, including automatic fixups and merging. Python API argument names are checked against the actual processor classes, not just inspected in an options dictionary. Pin the tested yt-dlp version because this transport uses version-specific interfaces.
- Trim compatibility: fetch through the guarded downloader first, then trim a local file. Re-encode local cuts so a cut between keyframes retains video and audio. No remote FFmpeg input is used for trimming.
- Fix commits: [a11b296](https://github.com/bhedanikhilkumar-code/video-player/commit/a11b296d6ed8d665240ed2cbf5dda2954299cca9), followed by the effective-FFmpeg-guard and local-cut correction [839160f](https://github.com/bhedanikhilkumar-code/video-player/commit/839160fee16f1b9891ae2343fe9126897a90cb56). Tags: `v1.4`, `v1.8`.
- Verification: ten offline egress tests cover private/special and mixed DNS answers, numeric-address pinning, rebinding, malformed URLs, redirect/subrequest rejection, real urllib request-stack behavior with simulated sockets, transport fallback, supported protocols, finite times and effective FFmpeg arguments. A generated two-second video verifies that a between-keyframe cut keeps both audio and video. No request to a real private address was made.

### 2. Public API work and error responses were insufficiently bounded

- Where: `server/app.py`.
- Root cause: concurrency checks applied to queued task records, not all expensive metadata routes; there was no request admission rate/body-size bound, completed records could accumulate, malformed JSON/URLs could raise server errors, and raw extractor exception text was returned to clients. Expiring a running task record could also free a logical concurrency slot while its thread still ran.
- Fix: shared bounded work slots across tasks and metadata routes; a process-wide limit of 12 expensive admissions per minute; 16 KiB request bodies; at most eight retained task records; disk-space admission checks; a 64 MiB per-transfer limit and progress-time budget; synchronous validation of type/format/quality/time inputs. Keep active records until work finishes and release work slots even on failure. Use 128-bit task capability IDs, generic client-facing errors, no-store responses, explicit Origin checks, and cache-correct CORS variation.
- Fix commit: [922cb0b](https://github.com/bhedanikhilkumar-code/video-player/commit/922cb0bff1d0589163a0e7400fc5567c0ce2a669). Tag: `v1.5`.
- Verification: eight local API tests cover allowed/disallowed origins, no-store/CORS, invalid JSON shapes and malformed URLs, body size, global admission with spoofed forwarding headers, shared slots and error release, retained tasks/capability length, and generic errors. Live checks confirmed safe input rejection without starting media work.
- Operational trade-off: these are free-server safety limits, not a traffic-attack guarantee. The shared rate bucket is intentional and does not trust client-supplied IP headers. A merged output may exceed a single transfer's size; the transfer limit is not advertised as a final-file size guarantee.

### 3. Backup import could change the preferences object's prototype

- Where: backup parser/import and cross-tab preference merges in `index.html`.
- Root cause: an imported key was accepted using `k in prefs`, which includes inherited properties. Assigning an imported prototype key could change the target object's prototype. This was reproduced with the original merge locally; it was not demonstrated as remote code execution or global `Object.prototype` pollution.
- Fix: remove prototype-related keys recursively while parsing a backup; merge only the target's own preference keys, including cross-tab merges; reject invalid root shapes and files over 10 MiB before both backup readers read them. Normal note/title text remains data and is not rewritten as HTML.
- Fix commit: [be52d5c](https://github.com/bhedanikhilkumar-code/video-player/commit/be52d5c7925c94eafe5aa11d1790696a273f2f02). Tag: `v1.6`.
- Verification: the regression test exercises the actual import merge with unsanitized input, nested malicious keys, valid preference values/text, invalid roots and input-size bounds. The old merge changed its target prototype; the fixed merge does not. The deployed frontend source contains the parser and own-key guard.

### 4. Frontend had no frame-embedding restriction

- Where: new Cloudflare Pages `_headers` configuration.
- Root cause: the page could be embedded without an application-supplied anti-framing policy.
- Fix: `frame-ancestors 'none'` and `X-Frame-Options: DENY`, plus `base-uri 'self'`, `object-src 'none'`, `form-action 'self'`, MIME sniffing prevention, referrer policy and restrictions on unused device capabilities. Serve `sw.js` with `Cache-Control: no-cache` so updates can be checked.
- Fix commit: [cc9b24e](https://github.com/bhedanikhilkumar-code/video-player/commit/cc9b24ea52d6401d89857ca82cd2f80077b87590). Tag: `v1.2`.
- Verification: a header regression test and live response checks confirm the deployed policy. A browser check confirms the player still boots and renders without console errors.
- Limit: this CSP is intentionally a baseline document policy, not a strict script-source/XSS policy. It does not claim to eliminate all DOM-XSS risk.

### 5. Flask dependency was below a published security fix

- Where: `server/requirements.txt`.
- Root cause: Flask was pinned to `3.0.3`, which is in the advisory's affected range.
- Fix: update to Flask `3.1.3`.
- Fix commit: [4f033e6](https://github.com/bhedanikhilkumar-code/video-player/commit/4f033e68fdc18b59ec7cf95117f70dec74b20e87). Tag: `v1.3`.
- Verification: pip-audit reports no known advisories in the resolved final Python requirements at review time. Import/compile and API regression tests pass.
- Applicability: the advisory concerns particular Flask session access behind caches. This app does not currently use Flask sessions, so this was dependency remediation, **not a confirmed session-data leak in this app**.
- Source: [Flask GHSA-68rp-wp8r-4726](https://github.com/pallets/flask/security/advisories/GHSA-68rp-wp8r-4726).

### 6. Technical stats accepted unauthenticated cross-window messages

- Where: the optional technical-stats postMessage listener in `index.html`.
- Root cause: this secondary listener checked message shape but not its origin or source window. A window with a reference to the app could spoof displayed technical stats. The main playback listener already had source/origin checks.
- Fix: require both the current player iframe's window and a supported YouTube origin before parsing or applying the stats message.
- Fix commit: [7a9477c](https://github.com/bhedanikhilkumar-code/video-player/commit/7a9477cfe8effce896f15fb9d51b054b1da3a7a3). Tag: `v1.9`.
- Verification: a Node regression test exercises the actual listener: a foreign origin, another source window, or a missing current iframe cannot change its state; legitimate messages still work. The guard is present in deployed source.
- Impact limit: this was display-state spoofing in a session-only optional stats panel, not demonstrated code execution, data disclosure or control of the main player.

## Verification record

Review snapshot: [7a9477c](https://github.com/bhedanikhilkumar-code/video-player/commit/7a9477cfe8effce896f15fb9d51b054b1da3a7a3). Seven fix commits cover the six finding categories above.

- `node --test --test-concurrency=4 tests/*.test.cjs`: 81 test files passed on the reviewed snapshot.
- `python tests/security_egress_test.py`: 10 passed.
- `python tests/security_api_test.py`: 8 passed.
- `python tests/security_trim_test.py`: 1 passed with FFmpeg/FFprobe installed; the test explicitly skips when they are absent.
- The page has 79 script elements. Executable inline scripts were checked for JavaScript syntax; the bundled plain-text QR source was not executed.
- Final Python requirements audit: no known advisories reported by pip-audit at review time. This does not cover OS packages or unknown vulnerabilities.
- Current-tree detect-secrets scan: one entropy candidate was reviewed and was a keyboard shortcut character list, not a credential. Targeted high-confidence credential/private-key pattern checks across Git history returned no matches. This is not proof that every possible historical secret format is absent.
- Static review also covered DOM HTML sinks, imported library/settings values, URL-opening paths, postMessage handlers, service-worker shell/thumbnail caching, command argument construction and file-serving lookup. No additional exploit is claimed from those reviews. Scanner warnings are not automatically classified as exploitable vulnerabilities, and a clean scan is not a guarantee.

### Low-rate live checks

- Frontend: HTTP 200 with the framing/CSP headers above; deployed source has the backup guard; app boot marker is true; screenshot inspected and browser console was empty.
- Downloader: health reports `security_revision: media-guard-2` and the tested yt-dlp version after deployment.
- Invalid JSON root and malformed URL: HTTP 400.
- Allowed-origin preflight: HTTP 200 with the expected CORS header. Flask's automatic OPTIONS response is valid; HTTP 204 is not required.
- Disallowed Origin: HTTP 403 without an allow-origin header.
- Body above the configured bound: HTTP 413.
- API responses carry no-store and nosniff headers.
- No production rate-limit exhaustion or concurrency saturation test was performed.

## Compatibility and honest limits

- Downloader behavior is deliberately narrower: standard web ports only, guarded HTTP/HTTPS/native protocols, no live streams, bounded transfers/jobs, and a pinned extraction library. Sites requiring unsupported impersonation or external protocols may fail closed.
- Local trimming now downloads before cutting and re-encodes the cut. It can use more time than remote seeking, within the configured timeout.
- The frontend remains a client-side app with browser-local library/settings storage. No new account system, database or paid service was added.
- No end-to-end third-party download was performed in this security review. Media success coverage uses an offline generated fixture. No mobile-device matrix, OS/container vulnerability audit, independent penetration test, or exhaustive media-parser analysis was performed.
- Resource controls reduce abuse but cannot make a small shared free server immune to denial of service. CORS/Origin checks are browser controls, not authentication for non-browser clients.
- Existing service-worker users may receive the new frontend after the normal update/reload cycle; live verification checked the current network-served build.
- Only already-fixed findings are documented here. Any unresolved security concern is handled privately rather than published with reproduction details.

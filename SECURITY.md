# Security policy

This policy covers security reports for HD Video Player. It is not a security certification or a claim that the app, hosting providers or dependencies are free of vulnerabilities.

## Supported code

Security fixes target the latest code on `main`. There is no maintained backport schedule or long-term-support release line.

| Version or installation | Security maintenance |
| --- | --- |
| Latest `main` | Target for fixes; best-effort maintenance. |
| Older commits, tags and package snapshots | No separate backport commitment. Update to current code and check whether the issue still applies. |
| Personal forks / self-hosted copies | Their operators must apply updates and secure their own deployments. |

The primary frontend is `https://vp-player.pages.dev/`. The downloader is a separate backend at `https://vp-downloader.onrender.com`. A source fix, version tag or package publish does not prove that either live deployment has been updated. Installed PWAs and service-worker caches may also retain older frontend code.

## Reporting a vulnerability privately

**GitHub private vulnerability reporting is currently disabled for this repository. No dedicated private reporting channel is configured by this policy.** Do not publish sensitive details while waiting for one.

Until a private channel is available:

1. Open a GitHub issue only to request a private security-reporting channel. A neutral title such as `Private security contact requested` is enough.
2. Do not include the affected endpoint, exploit, payload, secret, vulnerable code location, personal data, screenshots of sensitive results or steps to reproduce in that public issue.
3. Wait for the maintainer to arrange a private channel. Do not send the report to an unverified address or account suggested by another commenter.

A public issue is not confidential. If even the existence of your report is sensitive, wait for a private channel rather than posting it. Do not put vulnerability details in ordinary issues, pull requests, commit messages or discussions.

The maintainer can enable GitHub's private vulnerability reporting in the repository's security settings. Once it is enabled, the repository's **Security > Advisories** area can offer **Report a vulnerability**. This policy must be updated to confirm that route before it is presented as available. Do not assume that a missing button or unavailable form submitted a report.

### What to include once a private channel is confirmed

- A concise summary and the affected component: frontend, service worker, storage/import handling, backend, dependency or packaging/workflow.
- Affected commit/tag, browser and OS, and whether you tested locally or observed a live deployment.
- Minimal reproduction steps with a small, non-destructive proof of concept, preferably against your own local checkout.
- Expected behavior, actual behavior, realistic impact and any prerequisites or user interaction.
- Redacted logs or screenshots if needed. Share the minimum necessary evidence, not unrelated data or full personal backups.
- Any suggested fix, workaround or regression test, and whether you want public credit.

Never send passwords, access tokens, recovery codes or someone else's personal media. If a secret may be exposed, identify its location without copying the secret into the report. Do not use it to test access.

## Response expectations and disclosure

This is a small, best-effort project, not a staffed incident-response service. There is no guaranteed acknowledgement, triage, fix or release deadline, and no paid bug-bounty program is promised.

A maintainer may ask for clarification, assess impact, develop a fix and coordinate disclosure. These are intended steps, not a service-level agreement. Lack of a reply is not permission to intensify testing, contact users or disclose private data.

Please keep actionable details private while a fix is being investigated and discuss a disclosure date through the confirmed private channel. Do not assume a fixed embargo period or that a source commit means all deployments are patched. A normal playback bug, unsupported codec, upstream refusal or free-host cold start belongs in the ordinary bug-reporting process unless it has a security impact. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Scope and testing boundaries

Relevant reports include defects in this repository's code or configuration that could affect confidentiality, integrity or availability, for example:

- unsafe rendering of imported text, metadata, subtitles or URLs;
- unauthorized exposure or modification of browser-stored information;
- unsafe server-side URL fetching, redirects, file handling or task access;
- exploitable dependency, deployment-header or package/workflow problems.

A dependency alert alone is useful context, but explain whether the vulnerable behavior is reachable here. Missing best-practice headers alone do not establish an exploit. Report evidence without overstating impact.

**This policy is not permission to probe the public website or backend.** Reproduce issues in your own local checkout with synthetic data and mocked network calls wherever possible. Ask for explicit scope and permission before any live security testing, including automated scanners or traffic generation.

Third-party infrastructure and services are outside this project's testing authority: GitHub, Cloudflare, Render, YouTube, media providers and other users' accounts or devices. Follow their own policies. An app bug involving an integration can be reported here without testing or attacking the provider.

### Do not

- Run denial-of-service, load, brute-force or high-volume scanning tests against public deployments. Free-tier capacity is limited.
- Access, enumerate, download, change or delete another person's jobs, files or data. Stop if unexpected data appears; retain only minimal redacted evidence.
- Use URL-fetching bugs to reach private networks, loopback services, cloud metadata endpoints or credentials. Demonstrate with a controlled local/mocked test instead.
- Persist access, install malware, modify production settings or deploy a proof of concept to the user's accounts.
- Try social engineering, phishing, credential stuffing, stolen credentials or physical attacks.
- Use the downloader to bypass YouTube restrictions, DRM, paywalls, access controls or content owners' rights.
- Publish secrets or working exploit details in a public issue, PR, test fixture or audit document.

Stop immediately if testing could harm availability, expose personal data or reach infrastructure you do not control. Do not continue to prove a larger impact.

## Good-faith research and safe-harbor limits

We welcome careful, good-faith reports that respect these boundaries and minimize harm. However, this document does **not** grant legal immunity, a blanket testing authorization, a waiver of third-party terms, or permission on behalf of hosting providers or other people. It makes no promise that a provider will not take action.

Get explicit authorization for any testing beyond your own local environment. If the scope is unclear, stop and ask through the confirmed private channel before proceeding. No financial reward, employment, automatic credit or legal protection is guaranteed by submitting a report.

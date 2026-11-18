const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Every script block parses, and the main boot flag is present.
let blocks = 0;
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) { blocks++; new vm.Script(m[1]); }
assert.equal(blocks, 79, 'all script blocks parse');
assert(html.indexOf('window.__vpMainOk325 = true') > 0, 'main flag');

// --- Round 525 fix 1: permanent embed errors offer Open on YouTube, not a dead Retry ---
// Error 100 (private/deleted), 101/150 (embed-disabled) and 2 (broken link) can never be
// fixed by tapping Try again - the reload refuses the same way. Those codes now swap the
// Retry chip for an "Open on YouTube" chip; Retry stays for errors a reload can beat.
assert(/<button class="chip" id="playerYtBtn" type="button" hidden>/.test(html), 'playerYtBtn chip exists in the player card');
assert(html.indexOf('id="playerYtBtn"') < html.indexOf('id="infoCard"'), 'chip sits with the player error UI, before the info card');
assert(/#playerRetryBtn,[^{]*#playerYtBtn,[^{]*#dlHandoffBtn\{margin-top:8px\}/.test(html), 'chip picks up the retry spacing rule');

const helper = html.match(/function showPlayerYt\(show\) \{[^}]*\}/);
assert(helper, 'showPlayerYt helper exists');
assert(helper[0].indexOf('T("Open on YouTube")') > 0, 'chip text translates through the existing Open on YouTube rows');

const click = html.match(/playerYtBtn\.addEventListener\("click", function \(\) \{[\s\S]*?\}\);/);
assert(click, 'chip click handler exists');
assert(click[0].indexOf('if (!curId) return;') > 0, 'click needs a current video');
assert(/window\.open\("https:\/\/www\.youtube\.com\/watch\?v=" \+ encodeURIComponent\(curId\), "_blank", "noopener"\)/.test(click[0]), 'click opens the video on youtube.com in a new tab');

const errPath = html.match(/var willSkip = qPos >= 0[\s\S]*?showPlayerYt\(permanentErr && !!curId\);/);
assert(errPath, 'error path decides Retry vs Open on YouTube');
assert(/var permanentErr = ec === 100 \|\| ec === 101 \|\| ec === 150 \|\| ec === 2;/.test(errPath[0]), 'permanent codes: 100, 101, 150, 2');
assert(/showPlayerRetry\(!willSkip && !permanentErr\);/.test(errPath[0]), 'Retry hidden for permanent codes');

// The chip hides on every path that clears the error UI.
const hides = html.match(/showPlayerYt\(false\)/g) || [];
assert(hides.length >= 4, 'chip hides on ready, auto-retry, retry tap and queue paths (' + hides.length + ' hide calls)');

// The chip repaints on a language switch (reuses the translated rows, no new strings needed).
assert(/__relang[\s\S]*?playerYtBtn && !playerYtBtn\.hidden/.test(html), 'language repaint covers the chip');
assert(/"Open on YouTube": \[/.test(html), 'Open on YouTube Hindi/Gujarati rows exist');

console.log('Round 525 Open-on-YouTube fallback wiring OK (' + blocks + ' script blocks parse)');

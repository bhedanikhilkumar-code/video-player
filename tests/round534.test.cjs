const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const server = fs.readFileSync(path.join(__dirname, '../server/app.py'), 'utf8');

// Every script block parses, and the main boot flag is present.
let blocks = 0;
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) { blocks++; new vm.Script(m[1]); }
assert.equal(blocks, 79, 'all script blocks parse');
assert(html.indexOf('window.__vpMainOk325 = true') > 0, 'main flag');

// --- Round 534 fix 1: the live origin is allowed by the downloader server ---
assert(server.includes('"https://vp-player.pages.dev"'), 'vp-player.pages.dev in ALLOWED_ORIGINS');

// --- Round 534 fix 2: transient network failures get their own code ---
assert(server.includes('code = "net_slow"'), 'net_slow classification');
assert(server.includes('timed out|timeout|Temporary failure'), 'net_slow patterns');

// --- Round 534 fix 3: every server error code has an app message ---
for (const code of ['net_slow', 'no_file', 'bad_format', 'bad_type']) {
  assert(html.includes(code + ':'), 'client ERR entry for ' + code);
}
const tr = html.match(/"The site was too slow for the free server\. Try again in a moment\.": \[("[^"]+"), ("[^"]+")\]/);
assert(tr, 'net_slow translation row');
assert(/[\u0900-\u097F]/.test(tr[1]), 'net_slow Hindi row');
assert(/[\u0A80-\u0AFF]/.test(tr[2]), 'net_slow Gujarati row');

// --- Round 534 new 1: automatic wake-retry ---
assert(html.includes('function runTask(body, onProg, onWake)'), 'runTask takes onWake');
assert(html.includes('if (++tries > 3) throw e;'), 'bounded start-request retries');
assert(html.includes('function dlWakeMsg(el, isText)'), 'wake message helper');
assert((html.match(/dlWakeMsg\(/g) || []).length >= 4, 'wake message used at all call sites');
assert(html.includes('"Still waking the free server - trying again automatically..."'), 'wake string present');

// --- Round 534 new 2: Designer themes ---
for (const p of ['sunset', 'ocean', 'forest', 'rose', 'lavender', 'amber']) {
  assert(html.includes(':root[data-palette="' + p + '"] body::before'), p + ' light glow');
  assert(html.includes(':root[data-theme="dark"][data-palette="' + p + '"] body::before'), p + ' dark glow');
}
assert(html.includes('palette534: ""'), 'pref default');
assert(html.includes('saved.palette534'), 'pref loader whitelist');
assert(html.includes('id = "dtRow534"'), 'picker row');
assert(html.includes('function applyPalette534()'), 'apply function');
assert(html.includes('window.__vpWnew283("Designer themes", "#dtRow534")'), "What's new entry");
assert(html.includes('"designer themes palette sunset ocean forest rose lavender amber colour background look appearance"'), 'feature finder keywords');
const tr2 = html.match(/"Designer themes": \[("[^"]+"), ("[^"]+")\]/);
assert(tr2, 'Designer themes translation row');
// Rows may be written as \uXXXX escapes in the source; decode before checking script.
const dec = (x) => JSON.parse(x);
assert(/[\u0900-\u097F]/.test(dec(tr2[1])), 'Designer themes Hindi row');
assert(/[\u0A80-\u0AFF]/.test(dec(tr2[2])), 'Designer themes Gujarati row');
console.log('round534 tests pass');

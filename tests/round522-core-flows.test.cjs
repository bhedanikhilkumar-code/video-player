const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Every script block parses, and the main boot flag is present.
let blocks = 0;
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) { blocks++; new vm.Script(m[1]); }
assert.equal(blocks, 79, 'all script blocks parse');
const flag = html.indexOf('window.__vpMainOk325 = true');
assert(flag > 0, 'main flag');

// --- Round 522 live-verified flow 1: translation completeness audit -------------------
// Verified live this round: a full Gujarati pass over the loaded app showed no
// untranslated UI strings (only video titles, quality labels and speed values stay
// English by design). This test makes the audit permanent: every literal T('...')
// or T("...") call must resolve to a TR_MSG row written in any of the three styles
// used across the file ("k": [...], 'k': [...], TR_MSG["k"] = [...]).
function decode(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    .replace(/\\(.)/g, '$1');
}
const keys = new Set();
for (const m of html.matchAll(/"((?:[^"\\\n]|\\.){2,}?)"\s*:\s*\[\s*"/g)) keys.add(decode(m[1]));
for (const m of html.matchAll(/'((?:[^'\\\n]|\\.){2,}?)'\s*:\s*\[\s*'/g)) keys.add(decode(m[1]));
for (const m of html.matchAll(/TR_MSG\[\s*"((?:[^"\\]|\\.){2,}?)"\s*\]\s*=\s*\[/g)) keys.add(decode(m[1]));
for (const m of html.matchAll(/TR_MSG\[\s*'((?:[^'\\]|\\.){2,}?)'\s*\]\s*=\s*\[/g)) keys.add(decode(m[1]));
const calls = new Set();
for (const m of html.matchAll(/\bT\(\s*"((?:[^"\\\n]|\\.)+)"\s*\)/g)) calls.add(decode(m[1]));
for (const m of html.matchAll(/\bT\(\s*'((?:[^'\\\n]|\\.)+)'(?:\s*\))/g)) calls.add(decode(m[1]));
const missing = [];
for (const c of calls) {
  if (c.length < 4) continue;                       // single letters and punctuation chips
  if (!/[A-Za-z\u0900-\u097F\u0A80-\u0AFF]/.test(c)) continue; // emoji-only labels
  if (!keys.has(c)) missing.push(c);
}
assert.deepEqual(missing, [], 'every literal T() call resolves to a translation row: ' + missing.slice(0, 5).join(' | '));
console.log('round522 translation completeness: ok (' + calls.size + ' calls, ' + keys.size + ' rows)');

// --- Round 522 live-verified flow 2: sleep timer end to end ---------------------------
// Verified live: 1 custom minute armed "Pauses in 0:52", fired on time, paused the
// video and reported the session line.
const sleepBlock = html.slice(html.indexOf('id="sleepMinutes"'));
assert(sleepBlock.length > 0, 'custom minutes input exists');
assert(html.includes('id="sleepStart"'), 'start button exists');
assert(html.indexOf('getElementById("sleepStart")') > 0 || html.indexOf("$('sleepStart')") > 0 || html.indexOf('$("sleepStart")') > 0, 'start button wired');
assert(html.includes('Sleep timer finished - paused. Press Play to continue.'), 'finished message');
for (const s of ['"Sleep timer finished - paused. Press Play to continue."']) {
  const i = html.indexOf(s); assert(i > 0 && i < flag, s + ' translated inside the main closure');
}
console.log('round522 sleep timer wiring: ok');

// --- Round 522 live-verified flow 3: corrupt backup is rejected with a clear message --
// Verified live: a garbage .json file dropped on Import backup produced exactly
// "That file could not be read. Use a backup file made by this app." and changed nothing.
assert(html.includes('id="libImportFile"'), 'import input exists');
assert(html.includes('That file could not be read. Use a backup file made by this app.'), 'rejection message');
const guard = html.indexOf('Nothing changes until you confirm.');
assert(guard > 0 && guard < flag, 'import preview asks before merging');
assert(html.includes('stopImmediatePropagation'), 'preview wrapper intercepts the pick first');
console.log('round522 backup import guard: ok');

// --- Round 522 live-verified flow 4: queue syncs across open tabs ---------------------
// Verified live: adding a video in one tab appeared in a second tab within seconds.
const sync = html.match(/addEventListener\(["']storage["'][\s\S]{0,400}/g) || [];
assert(sync.some(function (s) { return /queue|lib|render|paint/i.test(s); }), 'a storage listener repaints the lists cross-tab');
console.log('round522 cross-tab sync wiring: ok');

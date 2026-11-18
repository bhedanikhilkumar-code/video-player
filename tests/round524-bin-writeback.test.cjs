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

// --- Round 524 fix 1: expired bin entries must be written back, not just filtered -----
// The Recently removed bin drops rows older than 30 days (and invalid rows) when it
// loads, and again when the cross-tab listener re-reads vp-bin.v1. Before this fix the
// dropped rows stayed in storage until the next add/restore/empty, so a list meant to
// expire only ever grew. Both paths now persist the cleaned list when anything dropped.
const load = html.match(/try \{ var bin0 = JSON\.parse[\s\S]*?\} catch \(e\) \{\}/);
assert(load, 'bin load block exists');
assert(/if \(binItems\.length !== bin0\.length\) \{ try \{ localStorage\.setItem\(BIN_KEY, JSON\.stringify\(binItems\)\); \} catch \(e1\) \{\} \}/.test(load[0]), 'load writes back when entries were dropped');

const sync = html.match(/binItems = Array\.isArray\(freshB407\)[\s\S]*?binBaseline407 = JSON\.stringify\(binItems\);/);
assert(sync, 'cross-tab bin re-read exists');
assert(/if \(Array\.isArray\(freshB407\) && binItems\.length !== freshB407\.length\) \{ try \{ localStorage\.setItem\(BIN_KEY, JSON\.stringify\(binItems\)\); \} catch \(e3\) \{\} \}/.test(sync[0]), 'cross-tab re-read writes back when entries were dropped');

// The 30-day expiry and 20-row cap still guard both reads.
assert.equal((html.match(/30 \* 86400000/g) || []).length >= 3, true, '30-day expiry on load, sync and merge');
assert(/\.slice\(0, 20\)/.test(load[0]) && /\.slice\(0, 20\)/.test(sync[0]), '20-row cap kept');

console.log('Round 524 bin write-back wiring OK (' + blocks + ' script blocks parse)');

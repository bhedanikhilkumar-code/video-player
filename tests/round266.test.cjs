// Run: node tests/round266.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const context = vm.createContext({ prefs: {} });
for (const name of ['cleanPicPresets266', 'continueEligible266', 'swipeStep266']) {
  const start = html.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name + ' must exist');
  // These helpers are deliberately each one source line.
  vm.runInContext(html.slice(start, html.indexOf('\n', start)), context);
}
const good = { name: 'constructor', picBright: 120, picContrast: 100, picSat: 80 };
assert.equal(context.cleanPicPresets266([good]).length, 1);
assert.equal(context.cleanPicPresets266([good, good]).length, 1);
assert.equal(context.cleanPicPresets266([{ ...good, picBright: Infinity }]).length, 0);
assert.equal(context.cleanPicPresets266([{ ...good, picSat: 500 }]).length, 0);
assert.equal(context.cleanPicPresets266(null).length, 0);
assert.equal(context.cleanPicPresets266(Array.from({length: 8}, (_, i) => ({ ...good, name: String(i) }))).length, 6);
const video = { id: 'dQw4w9WgXcQ', t: 950, dur: 1000 };
context.prefs.finishAt = '';
assert.equal(context.continueEligible266(video), true);
context.prefs.finishAt = '90';
assert.equal(context.continueEligible266(video), false);
assert.equal(context.continueEligible266({ ...video, t: 500 }), true);
assert.equal(context.continueEligible266(null), false);
for (const seconds of [15, 30, 60, 90]) {
  context.prefs.swipeStep = seconds;
  assert.equal(context.swipeStep266(), seconds);
}
context.prefs.swipeStep = 500;
assert.equal(context.swipeStep266(), 30);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vp-syntax-'));
let blocks = 0;
try {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/text\/plain|application\/ld\+json/i.test(match[1])) continue;
    const file = path.join(dir, String(blocks++) + '.js');
    fs.writeFileSync(file, match[2]);
    execFileSync(process.execPath, ['--check', file]);
  }
} finally { fs.rmSync(dir, {recursive: true, force: true}); }
console.log('Round 266 helpers and ' + blocks + ' script blocks passed.');

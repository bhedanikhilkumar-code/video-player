// Run: node tests/round270.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function slice(from, to) { const a = html.indexOf(from); assert.ok(a >= 0, from + ' must exist'); const b = html.indexOf(to, a); assert.ok(b > a, to + ' must follow'); return html.slice(a, b); }

// Fix 1: watch?v=ID?t=90 still gives the id.
{
  const ctx = vm.createContext({ URL, URLSearchParams, decodeURIComponent });
  vm.runInContext(slice('function parseVideoId(', 'window.__vpParseId'), ctx);
  const p = ctx.parseVideoId, I = 'dQw4w9WgXcQ';
  assert.equal(p('https://www.youtube.com/watch?v=' + I + '?t=90'), I);
  assert.equal(p('https://www.youtube.com/watch?v=' + I + '&t=90'), I);
  assert.equal(p('https://www.youtube.com/watch?v=' + I + 'x'), null);
}
console.log('round270 tests ok');
// Fix 2: the link box reads time_continue like the page address does.
{
  const src = slice('function linkStartSeconds(', 'Object.assign(TR_MSG');
  assert.ok(src.includes('searchParams.get("time_continue")'));
  const ctx = vm.createContext({ URL, URLSearchParams });
  vm.runInContext(src, ctx);
  assert.equal(ctx.linkStartSeconds('https://www.youtube.com/watch?v=dQw4w9WgXcQ&time_continue=90'), 90);
  assert.equal(ctx.linkStartSeconds('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30&time_continue=90'), 30);
}
console.log('round270 fix2 ok');
// Fix 3: Clean link keeps minute/hour/clock start times.
{
  const tsrc = slice('window.vpParseTime = function', '(function readLinkParams');
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(tsrc, ctx);
  const body = slice('function timeOf(text) {', 'function cleanOf');
  const c2 = vm.createContext({ window: ctx.window });
  vm.runInContext(body, c2);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?t=1m'), 60);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?t=2h'), 7200);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?t=1m30s&si=x'), 90);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?t=90'), 90);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?si=x'), 0);
  assert.equal(c2.timeOf('https://youtu.be/dQw4w9WgXcQ?t=junk'), 0);
}
console.log('round270 fix3 ok');
// New 1: Ambient sounds - generators, level rule, saved setting cleaning.
{
  const ctx = vm.createContext({ Math, Array, Float32Array });
  vm.runInContext(slice('function ambFill270(', 'Object.assign(TR_MSG, {\n    "Ambient sounds"'), ctx);
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const energy = (a) => a.reduce((s, x) => s + x * x, 0) / a.length;
  const hf = (a) => { let s = 0; for (let i = 1; i < a.length; i++) s += (a[i] - a[i - 1]) ** 2; return s / a.length; };
  const out = {};
  for (const k of ['white', 'pink', 'brown', 'rain', 'ocean']) {
    const a = ctx.ambFill270(k, new Float32Array(16000), rnd); out[k] = a;
    assert.ok(energy(a) > 0.0005, k + ' must not be silent');
    assert.ok(a.every((x) => x >= -1 && x <= 1), k + ' must stay in range');
  }
  assert.ok(hf(out.white) / energy(out.white) > hf(out.brown) / energy(out.brown) * 5, 'brown is smoother than white');
  assert.equal(ctx.ambGain270(0, false, true), 0);
  assert.ok(ctx.ambGain270(100, true, true) < ctx.ambGain270(100, false, true));
  assert.equal(ctx.ambGain270(100, true, false), ctx.ambGain270(100, false, false));
  const c2 = vm.createContext({});
  vm.runInContext(slice('function cleanR269(o) {', '  Object.assign(TR_MSG, {\n    "Privacy screen"'), c2);
  const d = c2.cleanR269(null).amb; assert.deepEqual(JSON.parse(JSON.stringify(d)), { k: 'rain', v: 50, m: 0, duck: 1 });
  const e = JSON.parse(JSON.stringify(c2.cleanR269({ amb: { k: 'x', v: 900, m: 7, duck: 0 } }).amb));
  assert.deepEqual(e, { k: 'rain', v: 100, m: 0, duck: 0 });
  assert.equal(c2.cleanR269({ amb: [] }).amb.k, 'rain');
  assert.equal(c2.cleanR269({ amb: { k: 'ocean', m: 30 } }).amb.m, 30);
}
console.log('round270 new1 ok');

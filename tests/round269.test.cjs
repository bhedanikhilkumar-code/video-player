// Run: node tests/round269.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function slice(from, to) { const a = html.indexOf(from); assert.ok(a >= 0, from + ' must exist'); const b = html.indexOf(to, a); assert.ok(b > a, to + ' must follow'); return html.slice(a, b); }

// Voice control: what was heard becomes one command.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('var VOICE269 =', '  function voiceDo269'), ctx);
  const p = ctx.parseVoice269;
  assert.equal(p('Pause'), 'pause');
  assert.equal(p('please pause the video'), 'pause');
  assert.equal(p('play'), 'play');
  assert.equal(p('play next video'), 'next');
  assert.equal(p('go to previous'), 'previous');
  assert.equal(p('volume up'), 'louder');
  assert.equal(p('turn it down'), 'quieter');
  assert.equal(p('unmute'), 'unmute');
  assert.equal(p('mute'), 'mute');
  assert.equal(p('slow down'), 'slower');
  assert.equal(p('speed up'), 'faster');
  assert.equal(p('awaaz kam karo'), 'quieter');
  assert.equal(p('ruko'), 'pause');
  assert.equal(p('अगला'), 'next');
  assert.equal(p('go back'), 'back');
  assert.equal(p('banana'), '');
  assert.equal(p(''), '');
  assert.equal(p(null), '');
  assert.equal(p('playlist'), ''); // whole words only
}
// Privacy screen setting is cleaned on load and import.
// Round 304 fix 3: these fixtures were left behind when the second ambient sound
// (ambMix) joined cleanR269 in a later round, so this file failed although the app was
// right - the expected objects now carry the ambMix default, matching the loader.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function cleanR269(', '  Object.assign(TR_MSG'), ctx);
  assert.equal(JSON.stringify(ctx.cleanR269(null)), '{"escHide":0,"shake":0,"snaps":[],"amb":{"k":"rain","v":50,"m":0,"duck":1},"ambMix":{"k":"off","v":40}}');
  assert.equal(JSON.stringify(ctx.cleanR269({ escHide: 1, junk: 5 })), '{"escHide":1,"shake":0,"snaps":[],"amb":{"k":"rain","v":50,"m":0,"duck":1},"ambMix":{"k":"off","v":40}}');
  assert.equal(JSON.stringify(ctx.cleanR269({ escHide: 'yes', shake: 2 })), '{"escHide":0,"shake":2,"snaps":[],"amb":{"k":"rain","v":50,"m":0,"duck":1},"ambMix":{"k":"off","v":40}}');
  assert.equal(JSON.stringify(ctx.cleanR269({ shake: 7 })), '{"escHide":0,"shake":0,"snaps":[],"amb":{"k":"rain","v":50,"m":0,"duck":1},"ambMix":{"k":"off","v":40}}');
  assert.equal(JSON.stringify(ctx.cleanR269([1])), '{"escHide":0,"shake":0,"snaps":[],"amb":{"k":"rain","v":50,"m":0,"duck":1},"ambMix":{"k":"off","v":40}}');
}
// Shake to control: four sharp jolts in a second count, walking and repeats within 2.5 s do not.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function shakeStep269(', '  Object.assign(TR_MSG'), ctx);
  const run = (samples, step) => { const st = {}; let fired = 0, t = 1000; for (const a of samples) { if (ctx.shakeStep269(st, a[0], a[1], a[2], t)) fired++; t += step; } return fired; };
  const walk = []; for (let i = 0; i < 100; i++) walk.push([Math.sin(i) * 3, 9.8 + Math.cos(i) * 3, Math.sin(i * 2) * 2]);
  assert.equal(run(walk, 20), 0);
  const shake = []; for (let i = 0; i < 14; i++) shake.push([i % 2 ? 15 : -15, i % 2 ? -12 : 12, i % 2 ? 10 : -10]);
  assert.equal(run(shake, 60), 1);
  assert.equal(run(shake.concat(shake), 60), 1); // second burst is inside the 2.5 s wait
  assert.equal(run([[1, 2, 3], ['x', 2, 3], [NaN, 1, 1]], 50), 0);
}
// Queue snapshots: adding, duplicate and empty cases, the cap of 5, and cleaning of stored snapshots.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function snapKey269(', '  Object.assign(TR_MSG'), ctx);
  vm.runInContext(slice('function cleanR269(', '  Object.assign(TR_MSG'), ctx);
  const q = [{ id: 'aaaaaaaaaaa', title: 'A' }, { id: 'bbbbbbbbbbb' }, { id: 'bad' }, null];
  let r = ctx.snapAdd269([], q, 1000);
  assert.equal(r.result, 'added'); assert.equal(r.snaps[0].q.length, 2); assert.equal(r.snaps[0].t, 1000);
  assert.equal(ctx.snapAdd269(r.snaps, q, 2000).result, 'same');
  assert.equal(ctx.snapAdd269([], [], 1).result, 'empty');
  assert.equal(ctx.snapAdd269([], [{ id: 'bad' }], 1).result, 'empty');
  let s = [];
  for (let i = 0; i < 7; i++) s = ctx.snapAdd269(s, [{ id: 'ccccccccccc'.slice(0, 10) + i }], 100 + i).snaps;
  assert.equal(s.length, 5); assert.equal(s[0].t, 106); assert.equal(s[4].t, 102);
  const c = ctx.cleanR269({ snaps: [{ t: 5, q: [{ id: 'aaaaaaaaaaa', title: 'x'.repeat(500) }] }, { t: 0, q: [{ id: 'aaaaaaaaaaa' }] }, { t: 7, q: [] }, { t: 8 }, 'junk'] });
  assert.equal(c.snaps.length, 1); assert.equal(c.snaps[0].q[0].title.length, 120);
}
// Finish by: speed needed and clock parsing.
{
  const ctx = vm.createContext({ Date });
  vm.runInContext(slice('function finishPlan269(', '  Object.assign(TR_MSG'), ctx);
  const f = ctx.finishPlan269;
  assert.equal(f(0, 100).kind, 'none');
  assert.equal(f(100, 0).kind, 'late');
  assert.equal(f(100, -5).kind, 'late');
  assert.equal(f(100, 100).kind, 'normal');
  assert.equal(f(100, 200).kind, 'normal');
  assert.deepEqual({ ...f(140, 100) }, { kind: 'speed', speed: 1.4 });
  assert.equal(f(101, 100).speed, 1.05); // always rounded up so it really finishes in time
  assert.equal(f(200, 100).speed, 2);
  assert.equal(f(201, 100).kind, 'toofast');
  const now = new Date(2026, 10, 13, 22, 0, 0).getTime();
  assert.equal(new Date(ctx.nextClock269('23:30', now)).getHours(), 23);
  assert.equal(ctx.nextClock269('23:30', now) - now, 90 * 60000);
  assert.equal(ctx.nextClock269('21:00', now) - now, 23 * 3600000); // already past today: tomorrow
  assert.equal(ctx.nextClock269('25:00', now), 0);
  assert.equal(ctx.nextClock269('', now), 0);
}
// Fix 1: a library item whose title is not text no longer survives validation as-is.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function validItem(', '  // Queue remembers its place'), ctx);
  const a = { id: 'dQw4w9WgXcQ', title: { a: 1 } }, b = { id: 'dQw4w9WgXcQ', title: 'ok' }, c = { id: 'dQw4w9WgXcQ' };
  assert.equal(ctx.validItem(a), true); assert.equal(a.title, '');
  assert.equal(ctx.validItem(b), true); assert.equal(b.title, 'ok');
  assert.equal(ctx.validItem(c), true); assert.equal(c.title, undefined);
  assert.ok(!ctx.validItem({ id: 5 }) && !ctx.validItem(null) && !ctx.validItem({ id: 'short' }));
}
console.log('round269 tests ok');

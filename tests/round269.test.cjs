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
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function cleanR269(', '  Object.assign(TR_MSG'), ctx);
  assert.equal(JSON.stringify(ctx.cleanR269(null)), '{"escHide":0,"shake":0}');
  assert.equal(JSON.stringify(ctx.cleanR269({ escHide: 1, junk: 5 })), '{"escHide":1,"shake":0}');
  assert.equal(JSON.stringify(ctx.cleanR269({ escHide: 'yes', shake: 2 })), '{"escHide":0,"shake":2}');
  assert.equal(JSON.stringify(ctx.cleanR269({ shake: 7 })), '{"escHide":0,"shake":0}');
  assert.equal(JSON.stringify(ctx.cleanR269([1])), '{"escHide":0,"shake":0}');
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
console.log('round269 tests ok');

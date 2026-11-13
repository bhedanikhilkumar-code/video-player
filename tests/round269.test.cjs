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
console.log('round269 tests ok');

// Run: node tests/round268.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function grab(ctx, name) {
  const start = html.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name + ' must exist');
  vm.runInContext(html.slice(start, html.indexOf('\n', start)), ctx);
}
// Voice announcements: line is built from the title, whitespace tidied, long titles cut, empty title says nothing.
{
  const ctx = vm.createContext({});
  grab(ctx, 'announceLine268');
  assert.equal(ctx.announceLine268('  Hello   world ', 'Now playing: {t}'), 'Now playing: Hello world');
  assert.equal(ctx.announceLine268('', 'Now playing: {t}'), '');
  assert.equal(ctx.announceLine268(null, 'Now playing: {t}'), '');
  assert.equal(ctx.announceLine268('x'.repeat(300), '{t}').length, 140);
}

// Eye rest: due only for known intervals once enough playing time has passed.
{
  const ctx = vm.createContext({});
  grab(ctx, 'eyeDue268');
  assert.equal(ctx.eyeDue268(1199, 20), false);
  assert.equal(ctx.eyeDue268(1200, 20), true);
  assert.equal(ctx.eyeDue268(5000, 0), false);
  assert.equal(ctx.eyeDue268(5000, 7), false);
  assert.equal(ctx.eyeDue268(2700, 45), true);
}

// Play range: cleaning, and what the range asks for at a given moment.
{
  const ctx = vm.createContext({});
  const multi = (n) => { const a = html.indexOf('function ' + n + '('); vm.runInContext(html.slice(a, html.indexOf('\n  }\n', a) + 4), ctx); };
  multi('rangeAction268'); multi('rangeText268');
  const start = html.indexOf('function cleanRanges268('); vm.runInContext(html.slice(start, html.indexOf('\n  // What the range wants', start)), ctx);
  const ok = 'dQw4w9WgXcQ';
  const c = ctx.cleanRanges268({ [ok]: [10, 60], bad: [1, 2], aaaaaaaaaaa: [50, 20], bbbbbbbbbbb: [0, 0], ccccccccccc: ['x', 'y'], ddddddddddd: [5.4, 0] });
  assert.deepEqual(Object.keys(c).sort(), ['ddddddddddd', ok].sort());
  assert.equal(JSON.stringify(c.ddddddddddd), '[5,0]');
  assert.equal(JSON.stringify(ctx.cleanRanges268(null)), '{}');
  assert.equal(JSON.stringify(ctx.cleanRanges268([1, 2])), '{}');
  assert.equal(ctx.rangeAction268([10, 60], 0, false), 'start');
  assert.equal(ctx.rangeAction268([10, 60], 9.5, false), '');
  assert.equal(ctx.rangeAction268([10, 60], 30, true), '');
  assert.equal(ctx.rangeAction268([10, 60], 60, true), 'end');
  assert.equal(ctx.rangeAction268([0, 60], 61, true), 'end');
  assert.equal(ctx.rangeAction268(undefined, 5, false), '');
  assert.equal(ctx.rangeText268([75, 0]), '1:15 - end');
}

// Check saved videos: how the public title service status maps to a verdict.
{
  const ctx = vm.createContext({});
  grab(ctx, 'oembedVerdict268');
  assert.equal(ctx.oembedVerdict268(200), 'ok');
  assert.equal(ctx.oembedVerdict268(404), 'gone');
  assert.equal(ctx.oembedVerdict268(400), 'gone'); // the service answers 400 for ids that do not exist
  assert.equal(ctx.oembedVerdict268(401), 'blocked');
  assert.equal(ctx.oembedVerdict268(429), 'unknown'); // busy is never treated as removed
  assert.equal(ctx.oembedVerdict268(500), 'unknown');
}
console.log('round268 tests ok');

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
console.log('round268 tests ok');

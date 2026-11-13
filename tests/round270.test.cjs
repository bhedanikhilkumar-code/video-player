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

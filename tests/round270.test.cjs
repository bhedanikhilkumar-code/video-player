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

// Run: node tests/round271.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function slice(from, to) { const a = html.indexOf(from); assert.ok(a >= 0, from + ' must exist'); const b = html.indexOf(to, a); assert.ok(b > a, to + ' must follow'); return html.slice(a, b); }
// New 1: Blocked channels list rules.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function cleanR271(', 'Object.assign(TR_MSG, {\n    "Blocked channels"'), ctx);
  const c = ctx.cleanR271;
  assert.equal(JSON.stringify(c(null)), '{"block":[]}');
  assert.equal(JSON.stringify(c({ block: ['Blender', 'blender', ' Rick  Astley ', 5, {}, ''] }).block), '["Blender","Rick Astley"]');
  assert.equal(c({ block: Array.from({ length: 40 }, (_, i) => 'c' + i) }).block.length, 30);
  assert.equal(ctx.isBlocked271('BLENDER', ['Blender']), true);
  assert.equal(ctx.isBlocked271('', ['Blender']), false);
  assert.equal(ctx.isBlocked271('Other', ['Blender']), false);
}
console.log('round271 new1 ok');

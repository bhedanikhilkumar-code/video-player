// Run: node tests/round267.test.cjs. No dependencies.
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
// Volume ceiling: effVol never exceeds the ceiling, ignores unknown values.
{
  const ctx = vm.createContext({ prefs: { volume: 90, nightVol: 0, volCeil: 100 }, nightOn: () => false });
  grab(ctx, 'effVol');
  assert.equal(ctx.effVol(), 90);
  ctx.prefs.volCeil = 70; assert.equal(ctx.effVol(), 70);
  ctx.prefs.volume = 40; assert.equal(ctx.effVol(), 40);
  ctx.prefs.volCeil = 'x'; ctx.prefs.volume = 90; assert.equal(ctx.effVol(), 90);
  ctx.prefs.volCeil = 85; ctx.prefs.nightVol = 30; ctx.nightOn = () => true; assert.equal(ctx.effVol(), 30);
}
console.log('round267 ok');

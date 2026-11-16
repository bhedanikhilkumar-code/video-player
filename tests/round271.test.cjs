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
  vm.runInContext(slice('function cleanWords271(', 'Object.assign(TR_MSG, {\n    "Skip by title words"'), ctx);
  vm.runInContext(slice('function cleanR271(', 'Object.assign(TR_MSG, {\n    "Blocked channels"'), ctx);
  const c = ctx.cleanR271;
  assert.equal(JSON.stringify(c(null)), JSON.stringify({ block: [], words: [], favFeed: false, feedMax: 0 }));
  assert.equal(JSON.stringify(c({ block: ['Blender', 'blender', ' Rick  Astley ', 5, {}, ''] }).block), '["Blender","Rick Astley"]');
  assert.equal(c({ block: Array.from({ length: 40 }, (_, i) => 'c' + i) }).block.length, 30);
  assert.equal(ctx.isBlocked271('BLENDER', ['Blender']), true);
  assert.equal(ctx.isBlocked271('', ['Blender']), false);
  assert.equal(ctx.isBlocked271('Other', ['Blender']), false);
}
console.log('round271 new1 ok');
// Fix 1: Tag videos, Weekly plan, Review desk and Today's list warn when storage is full.
// Round 474: rounds 467-472 routed these saves through the shared merge helper, whose
// empty catch silently dropped the warning. The contract now lives in the helper.
{
  assert.ok(html.includes('catch (e) { if (typeof storageWarn === "function") storageWarn(); }\n    return latest;'), 'merge helper must warn on a failed save');
  for (const v of ['tags', 'plan', 'rv']) {
    assert.ok(html.includes('function save(){' + v + '=vpMergeSave467('), v + ' save must route through the merge helper');
  }
  assert.ok(html.includes("try{localStorage.setItem(KEY,JSON.stringify(out));}catch(e){if(typeof storageWarn==='function')storageWarn();}"), 'today save must warn');
}
console.log('round271 fix1 ok');
// New 2: Skip by title words rules.
{
  const ctx = vm.createContext({});
  vm.runInContext(slice('function cleanWords271(', 'Object.assign(TR_MSG, {\n    "Skip by title words"'), ctx);
  assert.equal(JSON.stringify(ctx.cleanWords271([' Live ', 'live', 'trailer', 7, ''])), '["Live","trailer"]');
  assert.equal(ctx.cleanWords271(Array.from({ length: 15 }, (_, i) => 'w' + i)).length, 10);
  assert.equal(ctx.titleHit271('Big Show LIVE from Delhi!', ['live']), 'live');
  assert.equal(ctx.titleHit271('We deliver olives', ['live']), '');
  assert.equal(ctx.titleHit271('Official Trailer #2', ['trailer']), 'trailer');
  assert.equal(ctx.titleHit271('anything', []), '');
  assert.equal(ctx.titleHit271('a b', ['']), '');
}
console.log('round271 new2 ok');

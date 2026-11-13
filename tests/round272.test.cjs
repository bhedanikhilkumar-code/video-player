// Run: node tests/round272.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
// Fix 1: Watch stats, Recently removed, channel list and lyrics sync warn when a save fails.
for (const [fn, key] of [['saveStats', 'STATS_KEY'], ['binSave', 'BIN_KEY'], ['vpChansSave', 'CHANS_KEY'], ['lyrSyncSave', 'LYR_SYNC_KEY']]) {
  const i = html.indexOf('function ' + fn + '()'); assert.ok(i > 0, fn);
  const line = html.slice(i, html.indexOf('\n', i));
  assert.ok(line.includes('storageWarn()'), fn + ' must warn on a failed save');
  assert.ok(!/catch \(e\) \{\} \}$/.test(line), fn + ' must not swallow the error');
}
console.log('round272 fix1 ok');
// Fix 2: stats cross-tab.
assert.ok(html.includes('window.addEventListener("pagehide", function () { if (statsDirty) { statsDirty = false; saveStats(); } });'));
assert.ok(!html.includes('window.addEventListener("pagehide", saveStats);'));
assert.ok(html.includes('e.key !== STATS_KEY || !e.newValue || statsDirty'));
console.log('round272 fix2 ok');
// Fix 3: changing blocked channels keeps the title words.
assert.ok(html.includes('function put(arr) { var o = cleanR271(prefs.r271); o.block = cleanR271({ block: arr }).block; prefs.r271 = o; savePrefs(); }'));
assert.ok(!html.includes('prefs.r271 = cleanR271({ block: arr })'));
console.log('round272 fix3 ok');
// New 1: Favourites feed pick rule (least recently played favourite, never-played first, not queued, not playing).
{
  const vm = require('node:vm'); const a = html.indexOf('function qFavPeek272()'); const b = html.indexOf('function qFeedPull()', a);
  const ctx = vm.createContext({ prefs: { r271: { favFeed: true } }, curId: 'cccccccccc1', lib: { favs: [{ id: 'aaaaaaaaaa1' }, { id: 'bbbbbbbbbb1' }, { id: 'cccccccccc1' }, { id: 'dddddddddd1' }], hist: [{ id: 'bbbbbbbbbb1' }, { id: 'aaaaaaaaaa1' }], queue: [] }, findIn(l, id) { return l.findIndex(x => x.id === id); } });
  vm.runInContext(html.slice(a, b), ctx);
  assert.equal(ctx.qFavPeek272(), 100003); // d: never played
  ctx.lib.queue.push({ id: 'dddddddddd1' }); assert.equal(ctx.qFavPeek272(), 100000); // a: oldest in history (index 1)
  ctx.prefs.r271.favFeed = false; assert.equal(ctx.qFavPeek272(), -1);
}
console.log('round272 new1 ok');
// Fix 4: r271 must be a default pref so an import on a fresh device restores it.
assert.ok(html.includes('r271: { block: [], words: [], favFeed: false }, '));
console.log('round272 fix4 ok');

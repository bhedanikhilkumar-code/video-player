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
  // Round 318 fix 2: round 316 made the feed skip never-suggest videos via neverHas316,
  // which this context never defined, so the test died with ReferenceError before
  // asserting anything. Mirror the app's helper and cover the skip itself.
  const ctx = vm.createContext({ prefs: { r271: { favFeed: true }, never316: [] }, curId: 'cccccccccc1', lib: { favs: [{ id: 'aaaaaaaaaa1' }, { id: 'bbbbbbbbbb1' }, { id: 'cccccccccc1' }, { id: 'dddddddddd1' }], hist: [{ id: 'bbbbbbbbbb1' }, { id: 'aaaaaaaaaa1' }], queue: [] }, findIn(l, id) { return l.findIndex(x => x.id === id); }, neverHas316(id) { return ctx.prefs.never316.indexOf(id) >= 0; } });
  vm.runInContext(html.slice(a, b), ctx);
  assert.equal(ctx.qFavPeek272(), 100003); // d: never played
  ctx.prefs.never316.push('dddddddddd1'); assert.equal(ctx.qFavPeek272(), 100000); // d flagged: a is oldest in history
  ctx.prefs.never316.length = 0;
  ctx.lib.queue.push({ id: 'dddddddddd1' }); assert.equal(ctx.qFavPeek272(), 100000); // a: oldest in history (index 1)
  ctx.prefs.r271.favFeed = false; assert.equal(ctx.qFavPeek272(), -1);
}
console.log('round272 new1 ok');
// Fix 4: r271 must be a default pref so an import on a fresh device restores it.
assert.ok(html.includes('r271: { block: [], words: [], favFeed: false, feedMax: 0 }, '));
console.log('round272 fix4 ok');
// New 2: Feed limit counts pulls, stops at the limit, resets when a video outside the feed loads.
{
  const vm = require('node:vm'); const a = html.indexOf('var feedCount272 = 0'); const b = html.indexOf('// Speed keys (round 148)', a);
  assert.ok(a > 0 && b > a);
  const toasts = []; let listener = null;
  const ctx = vm.createContext({ prefs: { r271: { favFeed: true, feedMax: 3 }, laterFeed: false, never316: [] }, neverHas316(id) { return ctx.prefs.never316.indexOf(id) >= 0; }, curId: 'x', lib: { favs: Array.from({ length: 8 }, (_, i) => ({ id: 'fav' + i + 'aaaaaaa'.slice(0, 7), title: 't' + i })), hist: [], queue: [], later: [] }, findIn(l, id) { return l.findIndex(x => x.id === id); }, saveLib() {}, renderLib() {}, toast(m) { toasts.push(m); }, T: x => x, laterSnoozed: () => false, setTimeout: f => f(), document: { addEventListener(n, f) { listener = f; } } });
  vm.runInContext(html.slice(a, b), ctx);
  for (let i = 0; i < 3; i++) { assert.equal(ctx.qFeedPull(), true); ctx.curId = ctx.lib.queue[ctx.lib.queue.length - 1].id; listener(); }
  assert.equal(ctx.qFeedPull(), false); assert.ok(toasts.some(t => t === 'Feed stopped after {n} videos.'.replace('{n}', 3)));
  ctx.curId = 'user-picked'; listener(); assert.equal(ctx.qFeedPull(), true); // picking a video yourself starts again
  ctx.prefs.r271.feedMax = 0; for (let i = 0; i < 3; i++) assert.equal(ctx.qFeedPull(), true); // no limit
}
console.log('round272 new2 ok');

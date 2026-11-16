// Run: node tests/round272.test.cjs. No dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
// Fix 1: Watch stats, Recently removed, channel list and lyrics sync warn when a save fails.
for (const [fn, key] of [['saveStats', 'STATS_KEY'], ['binSave', 'BIN_KEY'], ['vpChansSave', 'CHANS_KEY']]) {
  const i = html.indexOf('function ' + fn + '()'); assert.ok(i > 0, fn);
  const line = html.slice(i, html.indexOf('\n', i));
  assert.ok(line.includes('storageWarn()'), fn + ' must warn on a failed save');
  assert.ok(!/catch \(e\) \{\} \}$/.test(line), fn + ' must not swallow the error');
}
// Round 474: lyrSyncSave routes through the round-467 merge helper; the warning contract
// lives there (the empty catch in the helper was the regression this round fixed).
assert.ok(html.includes('function lyrSyncSave() { lyrSync = vpMergeSave467('), 'lyrSyncSave must route through the merge helper');
assert.ok(html.includes('catch (e) { if (typeof storageWarn === "function") storageWarn(); }\n    return latest;'), 'merge helper must warn on a failed save');
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
  // Round 322 fix: the slice used to run to qFeedPull, but rounds 311 and 320 added the
  // playlist-feed and channel-feed blocks in between, whose eval-time code (a $() chip
  // lookup and an Object.assign(TR_MSG, ...)) dies in this bare context before any
  // assertion runs. This test only exercises qFavPeek272, so stop the slice right after
  // it, at the round 311 block's leading comment.
  const vm = require('node:vm'); const a = html.indexOf('function qFavPeek272()'); const b = html.indexOf('// Round 311 new 1: the chosen playlist', a);
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
  // Round 322 fix: the slice now also covers round 320's channel-feed block, whose
  // Object.assign(TR_MSG, ...) runs at eval time, so the test died with
  // ReferenceError: TR_MSG is not defined before asserting anything (the same class of
  // harness break round 318 fix 2 patched for neverHas316). Mirror a plain TR_MSG object.
  // Round 322 fix, part 2: the same slice ends with round 320's chip-building IIFE, which
  // reads qPlBtn311 (declared in round 311's block, outside the slice). Mirroring it as
  // null makes the IIFE return early, exactly like a page without that chip.
  const ctx = vm.createContext({ TR_MSG: {}, qPlBtn311: null, prefs: { r271: { favFeed: true, feedMax: 3 }, laterFeed: false, never316: [] }, neverHas316(id) { return ctx.prefs.never316.indexOf(id) >= 0; }, curId: 'x', lib: { favs: Array.from({ length: 8 }, (_, i) => ({ id: 'fav' + i + 'aaaaaaa'.slice(0, 7), title: 't' + i })), hist: [], queue: [], later: [] }, findIn(l, id) { return l.findIndex(x => x.id === id); }, saveLib() {}, renderLib() {}, toast(m) { toasts.push(m); }, T: x => x, laterSnoozed: () => false, setTimeout: f => f(), document: { addEventListener(n, f) { listener = f; } } });
  vm.runInContext(html.slice(a, b), ctx);
  for (let i = 0; i < 3; i++) { assert.equal(ctx.qFeedPull(), true); ctx.curId = ctx.lib.queue[ctx.lib.queue.length - 1].id; listener(); }
  assert.equal(ctx.qFeedPull(), false); assert.ok(toasts.some(t => t === 'Feed stopped after {n} videos.'.replace('{n}', 3)));
  ctx.curId = 'user-picked'; listener(); assert.equal(ctx.qFeedPull(), true); // picking a video yourself starts again
  ctx.prefs.r271.feedMax = 0; for (let i = 0; i < 3; i++) assert.equal(ctx.qFeedPull(), true); // no limit
}
console.log('round272 new2 ok');

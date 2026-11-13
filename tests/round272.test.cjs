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

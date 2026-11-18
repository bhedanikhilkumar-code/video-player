// Run: node tests/round526.test.cjs. No dependencies.
// Round 526 fix 1: the backup import summary must name Watch later (it always imported
// them, and the preview dialog counted them, but the done message did not), and the
// export summary must count them too - verified live on vp-player.pages.dev with a
// crafted backup whose only Watch later item imported while the message read
// "Imported 0 queued, 0 favourites and 0 playlists."
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// the import summary reports every merged list: queue, favourites, playlists, later,
// history, stats, moments, notes, lyrics, lyric sync, channels and channel choices,
// ratings, downloads and settings
assert.ok(html.includes('if (ln) libBackupMsg.textContent += " " + T("Watch later restored: ") + ln + ".";'),
  'import summary must report the Watch later count');
assert.ok(html.includes('T("Watch later restored: ")'), 'Watch later restored line exists');
assert.ok(html.includes('"Watch later restored: "'), 'Watch later restored key registered');
// it sits with the other restored-count lines, inside the import handler
const hnAt = html.indexOf('if (hn) libBackupMsg.textContent += " " + T("History restored: ")');
const lnAt = html.indexOf('if (ln) libBackupMsg.textContent += " " + T("Watch later restored: ")');
assert.ok(lnAt >= 0 && hnAt >= 0 && Math.abs(lnAt - hnAt) < 400, 'later count sits with history count in the import summary');
// the export summary counts Watch later like queue, favourites and history
assert.ok(html.includes('T("Watch later included: ")'), 'export summary reports Watch later');
// both new strings have Hindi and Gujarati rows
assert.ok(html.includes('"Watch later restored: ": ['), 'Watch later restored has translations');
assert.ok(html.includes('"Watch later included: ": ['), 'Watch later included has translations');
console.log('round526 backup summary test ok');

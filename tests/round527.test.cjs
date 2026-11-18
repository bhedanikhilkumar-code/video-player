// Run: node tests/round527.test.cjs. No dependencies.
// Round 527 fix 1: the two player frames had English-only titles - the last
// screen-reader names that ignored the app language (round 331's sweep already covers
// the Up next strip, rewind row, shake group, own-key list and photo-note picker).
// Both frames now get Hindi and Gujarati titles at creation, and the live main frame
// repaints on a language switch. Verified live on vp-player.pages.dev in Gujarati and
// Hindi at 390px: frame title, shake group and photo picker all spoke the app language.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// both player frames get translated titles at creation
assert.ok(html.includes('iframe.title = T("YouTube video player");'),
  'main player frame title must be translated');
assert.ok(html.includes('pframe.title = T("YouTube video player 2");'),
  'dual-view frame title must be translated');
assert.ok(html.includes('"YouTube video player": ['), 'YouTube video player has Hindi and Gujarati rows');
assert.ok(html.includes('"YouTube video player 2": ['), 'YouTube video player 2 has Hindi and Gujarati rows');

// the live main frame's title repaints on a language switch, not only at creation
assert.ok(html.includes('if (iframe) { try { iframe.title = T("YouTube video player"); } catch (e) {} }'),
  'main frame title must repaint through __relang');

// the older sweep must keep covering the labels round 331 fixed (no regression):
// it runs on load, on every language change, and once more after load for late-built
// elements, and it names the shake group and the photo-note picker
assert.ok(html.includes('["#shakeCard269 [role=group]", "Shake to control"]'),
  'round 331 sweep must keep the shake chip group');
assert.ok(html.includes('["#vphotoFile298", "Photo note image"]'),
  'round 331 sweep must keep the photo-note picker');
assert.ok(html.includes('(window.__relang = window.__relang || []).push(paint331);'),
  'round 331 sweep must keep repainting on language change');

// exactly one translation row owns the photo-note label (the round 527 draft briefly
// added a second, dead row)
assert.equal(html.split('"Photo note image": [').length - 1, 1,
  'Photo note image must have exactly one translation row');
console.log('round527 frame-title language test ok');

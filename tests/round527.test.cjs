// Run: node tests/round527.test.cjs. No dependencies.
// Round 527 fix 1: screen-reader names that stayed English in every language now
// follow the app language - found by auditing the code while the app ran in Gujarati
// on the live site (every visible control had repainted except these, which only a
// screen reader or the DOM ever shows).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// the Shake-to-control chip group takes its accessible name from the translated card
// title and repaints through the card's own paint() (registered in __relang)
assert.ok(html.includes('chips.setAttribute("aria-label", T("Shake to control"));'),
  'shake chip group aria-label must be translated');
const shakePaintAt = html.indexOf('chips.setAttribute("aria-label", T("Shake to control"));');
const shakeHintAt = html.indexOf('T("Shake the phone to go to the next video');
assert.ok(shakePaintAt >= 0 && shakeHintAt >= 0 && shakePaintAt - shakeHintAt < 600,
  'shake group label repaint must live inside the card paint hook');

// the photo-note image picker label repaints with the row through paint298p
assert.ok(html.includes('fileIn.setAttribute("aria-label", T("Photo note image"));'),
  'photo note file input aria-label must be translated');
assert.ok(html.includes('"Photo note image": ['), 'Photo note image has Hindi and Gujarati rows');

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
console.log('round527 screen-reader language test ok');

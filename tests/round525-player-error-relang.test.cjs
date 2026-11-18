const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Every script block parses, and the main boot flag is present.
let blocks = 0;
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) { blocks++; new vm.Script(m[1]); }
assert.equal(blocks, 79, 'all script blocks parse');
assert(html.indexOf('window.__vpMainOk325 = true') > 0, 'main flag');

// --- Round 525 fix 2: the player error line repaints on a language switch ---------------
// The error used to be written once, in the language of the moment it fired. It now keeps
// its cause in lastPlayerErr and repaints through __relang with the same T() rows.
const helper = html.match(/var lastPlayerErr = null;\n  function paintPlayerErr\(\) \{[\s\S]*?\n  \}/);
assert(helper, 'lastPlayerErr + paintPlayerErr exist');
for (const frag of [
  'T("This video is private, deleted, or the link is incomplete. It cannot be played.")',
  'T("This video\'s owner has disabled playback on other sites, so it cannot be embedded here.")',
  'T("Your browser could not decode this video (HTML5 playback error). Reloading the page usually fixes it.")',
  'T("The video link looks broken, so the video cannot be played.")',
  'T("This video cannot be played here.")',
  'T("This video is taking too long to load. Check your internet, or tap Try again.")',
  'T(" Skipping to the next video in the queue...")',
  'T(" Try another link.")'
]) assert(helper[0].indexOf(frag) > 0, 'paintPlayerErr covers: ' + frag.slice(3, 40));

// The language repaint hooks into __relang and only touches a visible error.
assert(/__relang = window\.__relang \|\| \[\]\)\.push\(function \(\) \{ if \(lastPlayerErr && playerError && !playerError\.hidden\) paintPlayerErr\(\); \}\)/.test(html), 'relang repaints only a visible error');

// Both error writers store the cause instead of freezing text.
assert(/lastPlayerErr = \{ kind: "embed", ec: ec, willSkip: willSkip \}; paintPlayerErr\(\);/.test(html), 'embed path stores its cause');
assert(/lastPlayerErr = \{ kind: "slow" \}; paintPlayerErr\(\);/.test(html), 'watchdog stores its cause');

// The old one-time compose is gone (no frozen text left behind).
assert(html.indexOf('var emsg = ec === 100') === -1, 'no dead one-time emsg compose');
assert(!/playerError\.textContent = emsg/.test(html), 'error text never bypasses paintPlayerErr on these paths');

console.log('Round 525 player-error relang wiring OK (' + blocks + ' script blocks parse)');

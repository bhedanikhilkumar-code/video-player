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

// --- Round 544 fix 1 + fix 2: the queue adopts the playing video's row on load ---
// Seen live: a queued video played from Recents/History/Search or the link box
// showed no ▶ marker (link-box loads drop the place to -1 in loadVideo), and a
// place restored to another row stayed on that row while a different queued
// video played, so Next would have run off the queue's end.
const flagIdx = html.indexOf('window.__vpMainOk325 = true');
const blockIdx = html.indexOf('Round 544 fix 1 + fix 2');
assert(blockIdx > 0 && blockIdx < flagIdx, 'listener block present before the boot flag');

// Placement regression (this round's own lesson, same as round 539 fix 1): the
// block first landed after the main closure's end inside the round-505 IIFE,
// where lib/curId/qPos/saveLib are out of scope - it registered but silently
// no-oped through its own try/catch (verified live: marker never appeared).
// The flag is set at top level AFTER the closure, so the block must sit before
// the closure's final })();.
const closureEnd = html.lastIndexOf('})();', flagIdx);
assert(closureEnd > 0 && blockIdx < closureEnd, 'listener sits inside the main closure, before its end');

// The listener adopts on the app's video-loaded event.
assert(html.includes('document.addEventListener("vp-video-loaded", function () {\n    try {\n      if (typeof qAdoptPlaying292 === "function") qAdoptPlaying292();'), 'empty place adopted first (fix 1)');
assert(html.includes('var ix544 = findIn(lib.queue, curId);'), 'row lookup for the playing video');
assert(html.includes('if (ix544 >= 0 && ix544 !== qPos) { qPos = ix544; qAfter = -1; saveLib(); renderLib(); }'), 'place moves to the playing row, removal spot cleared (fix 2)');

// The load path still drops the place for link-box loads, which is exactly what
// fix 1 rebuilds - guard the pairing so a future change to one half is noticed.
assert(html.includes('if (id) qPos = typeof queueIndex === "number" ? queueIndex : -1;'), 'link-box loads reset the place (the gap fix 1 covers)');
assert(html.includes('document.dispatchEvent(new Event("vp-video-loaded"))'), 'the load event the listener hooks');
console.log('PASS round544: queue adopts the playing video on load, listener inside the main closure, all 79 blocks parse');

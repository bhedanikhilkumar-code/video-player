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

// --- Round 531 fix 1: queue prune toasts use the singular for one removed video ------
// Seen live: the Only-these-channels prune removed Big Buck Bunny alone and toasted
// '1 videos removed from the queue.' Both prune chips (Blocked channels, Only these
// channels) now use '1 video removed from the queue.' for a single removal.
assert(html.includes('"1 video removed from the queue."'), 'singular prune toast string exists');
assert.equal(html.split('(snap.length - lib.queue.length) === 1 ? T("1 video removed from the queue.")').length - 1, 2,
  'both prune call sites use the singular form');

// --- Round 531 fix 2: the welcome-back greeting singularises and skips empty sides ---
// A single queued video read '1 videos wait in the queue and 0 are half-watched.' -
// plural grammar for one, and a zero count spelled out. The line now singularises
// and names only the sides that actually have videos.
for (const k of ['"1 video waits in the queue and {m} are half-watched."',
  '"{n} videos wait in the queue and 1 is half-watched."',
  '"1 video waits in the queue and 1 is half-watched."',
  '"1 video waits in the queue."', '"{n} videos wait in the queue."',
  '"1 half-watched video waits for you."', '"{m} half-watched videos wait for you."'])
  assert(html.includes(k), 'greeting variant ' + k);
assert(html.includes('else if (nQ) gline = T(nQ === 1 ? "1 video waits in the queue."'),
  'greeting names only the queue when nothing is half-watched');

// --- Round 531 fix 4: one imported moment no longer reads '1 new moments added.' -----
assert(html.includes('"1 new moment added."'), 'singular moment string exists');
assert(html.includes('add.length === 1 ? T("1 new moment added.")'), 'moments import singularises');

// --- Round 531 fix 5: one new link no longer reads '1 links added to the queue.' -----
assert(html.includes('"1 link added to the queue."'), 'singular link string exists');
assert(html.includes('n484 === 1 ? T("1 link added to the queue.")'), 'bulk link add singularises');

// --- Round 531 fix 3: one failed link no longer reads '1 videos have a problem:' -----
assert(html.includes('"1 video has a problem:"'), 'singular problem string exists');
assert(html.includes('chk268.bad.length === 1 ? T("1 video has a problem:")'), 'link checker singularises');

// Translation rows exist for every new string (Hindi and Gujarati arrays).
const trBlock = html.match(/"1 video removed from the queue\.": \["[^"]+", "[^"]+"\]/);
assert(trBlock, 'prune singular has Hindi and Gujarati rows');

console.log('Round 531 regression wiring OK (' + blocks + ' script blocks parse)');

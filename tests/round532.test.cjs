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

// --- Round 532 fix 1: hidden local-file workbench jumps explain themselves ------------
// Seen live: 4 of the 10 What's new rows (Playback cue sheet, Skip-ahead cue, Saved cues
// for this file, Save or restore playback cues) target cards inside #lpCtl, which stays
// hidden until a device file is loaded, so the tap toasted the generic 'This one shows up
// only when it can be used.' and moved nothing. The jump now names what unlocks the
// feature and scrolls to the Local file card.
assert(html.includes('"Load one of your own video or audio files first - this one works on device files."'),
  'specific device-file message exists');
assert(html.includes('el.closest("#lpCtl") && !el.closest("#lpCtl").offsetParent'),
  'lpCtl-hidden branch checks the container, not only the element');
assert(html.includes('var lpSec532 = document.getElementById("lp");'),
  'the branch scrolls to the Local file card');
assert(html.includes('if (lpColl532 && window.vpExpandSection) window.vpExpandSection(lpColl532.id);'),
  'a collapsed Local file section is expanded first');
// The new string keeps Hindi and Gujarati rows (Devanagari + Gujarati in one row).
const row = html.match(/"Load one of your own video or audio files first - this one works on device files\.": \[("[^"]+"), ("[^"]+")\]/);
assert(row, 'translation row present');
assert(/[\u0900-\u097F]/.test(row[1]), 'Hindi row is Devanagari');
assert(/[\u0A80-\u0AFF]/.test(row[2]), 'Gujarati row is Gujarati');
console.log('round532 tests pass');

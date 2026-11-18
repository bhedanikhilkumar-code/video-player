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

// --- Round 528 fix 1: the playback cue sheet hint must name the Play button as shown -
// The Hindi and Gujarati rows used to say "फिर Play दबाएं" / "પછી Play દબાવો" while the
// button itself reads चलाएं / ચલાવો (the round 348 labelling bug class). The hint now
// names the button in the app language.
const hintRow = html.match(/'Plan speed, volume and pause changes at chosen video times\. Device files only\. Arm for this visit, then press Play\. Seeking skips crossed cues; seeking back rearms later cues\.': \['([^']+)', '([^']+)'\]/);
assert(hintRow, 'cue sheet hint translation row exists');
assert(hintRow[1].includes('चलाएं दबाएं'), 'Hindi hint names the button as shown (चलाएं)');
assert(hintRow[2].includes('ચલાવો દબાવો'), 'Gujarati hint names the button as shown (ચલાવો)');
assert(!hintRow[1].includes('फिर Play दबाएं'), 'Hindi hint must not keep the bare English Play');
assert(!hintRow[2].includes('પછી Play દબાવો'), 'Gujarati hint must not keep the bare English Play');

// --- Round 528 fix 2: the round-517 reminder block must not re-add translation rows ---
// 'Pick a video first.', 'Play' and 'Not now' each had two identical TR_MSG rows after
// round 517 merged its strings; the live one could be deleted by a future cleanup.
assert.equal(html.split('"Pick a video first.":').length - 1, 1,
  'exactly one translation row owns Pick a video first.');
assert.equal(html.split('"Play":').length - 1, 1,
  'exactly one translation row owns Play');
assert.equal(html.split('"Not now":').length - 1, 1,
  'exactly one translation row owns Not now');

// --- Round 528 fix 4: the Circuit library count line must hide on an empty library ----
// A fresh library showed 'Circuits found: 0 of 0' right above the proper empty message.
// The count line only appears when at least one circuit exists.
assert(html.includes('$("clCount422").textContent = all.length ? T("Circuits found: {n} of {total}")'),
  'circuit count is gated on a non-empty library');

// --- Round 528 fix 5: no Last-good-position line without a loaded source --------------
// The Local playback recovery card showed 'Last good position: 0:00' with no file or
// link loaded at all. The position line now needs a loaded source.
assert(html.includes('T("Last good position") + ": " + fmt(good) : ""'),
  'recovery position line only appears when a source is loaded');

console.log('Round 528 regression wiring OK (' + blocks + ' script blocks parse)');

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

// --- Round 530 fix 1: the Spread channels known-channel line hides on an empty queue ---
// A fresh, empty queue showed 'Channel known for 0 of 0 upcoming videos.' - a nonsense
// counter on an empty state, seen live on a cleared profile (same class as round 528's
// circuit count). The line now appears only when at least one upcoming video exists.
assert(html.includes('$("spKnown").textContent = c.up.length ? T("Channel known for {a} of {b} upcoming videos.")'),
  'spread known-channel line is gated on a non-empty upcoming queue');

// --- Round 530 fix 2: the Spread channels card repaints on queue re-renders -----------
// The card painted only when opened, so its back-to-back and known-channel counts went
// stale while it stayed open - seen live: two videos queued with the card open and it
// still read '0 of 0 upcoming'. It now repaints on every library re-render.
assert(html.includes('var baseRenderLibSP530 = renderLib;'),
  'spread card chains the library renderer');
assert(html.includes('renderLib = function () { baseRenderLibSP530(); try { if (card.open) paint(); } catch (e) {} };'),
  'spread card repaints on every library re-render while open');

console.log('Round 530 regression wiring OK (' + blocks + ' script blocks parse)');

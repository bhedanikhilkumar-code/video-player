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

// --- Round 537 fix 1: hidden look-chips rows must not paint ---
// The author .look-chips display:flex rule beat the UA [hidden] rule, so the
// Colour-vision strength row stayed visible (empty) while the assist was off.
assert(html.includes('.look-chips[hidden]{display:none}'), 'hidden guard for look-chips');
const styleStr = html.match(/st\.textContent = "\.look-row\{[^"]*"/);
assert(styleStr, 'look style string found');
assert(styleStr[0].indexOf('.look-chips{display:flex;gap:6px;flex-wrap:wrap}.look-chips[hidden]{display:none}') > 0, 'guard sits inside the injected style');
assert(html.includes('strRow.hidden = k === "off"'), 'row still toggles hidden');

// --- Round 537 fix 2: MP3 quality chips show the picked bitrate ---
assert(html.includes('b.setAttribute("aria-pressed", q === mp3Q536 ? "true" : "false"); b.classList.toggle("active", q === mp3Q536);'), 'quality chips toggle .active with aria-pressed');

// --- Round 537 fix 3: Ambient light chip shows its on-state ---
assert(html.includes('ambGlowBtn.classList.toggle("active", prefs.ambGlow !== false)'), 'ambient chip toggles .active');

console.log('round537 tests pass');

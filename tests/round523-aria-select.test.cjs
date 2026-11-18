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

// --- Round 523 fix 1: select min-width must be capped at the row's real width ---------
// Found live at 390px: round 423 measured the selected option's text and set it as an
// inline min-width, relying on max-width:100% as the cap - but min-width beats max-width
// in CSS, so a long Gujarati title pushed the tag select 47px out of its card. The fix
// caps the measured width at the row's clientWidth before writing min-width.
const fit = html.match(/function fit\(s\) \{[\s\S]*?\n  \}/);
assert(fit, 'select fit function exists');
assert(/row\.clientWidth|clientWidth/.test(fit[0]), 'fit caps at the row width');
const capLine = fit[0].match(/var row423 = s\.parentElement, cap423 = row423 \? row423\.clientWidth : 0, px423 = Math\.ceil\(need\);\n      if \(cap423 > 0 && px423 > cap423\) px423 = cap423;/);
assert(capLine, 'min-width capped at the row clientWidth');
assert(/s\.style\.minWidth = px423 \+ "px"/.test(fit[0]), 'min-width written from the capped value');

// --- Round 523 fix 2: dynamic aria-labels must be translated and repaint --------------
// Found by scanning every dynamically created aria-label for unwrapped English: the
// accent dots (plain and custom), the Today and Week recap textareas and the subtitle
// sync -/+ buttons stayed English on Hindi and Gujarati phones. They must set their
// labels through T() and repaint on a language switch.
function decode(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    .replace(/\\(.)/g, '$1');
}
const keys = new Set();
for (const m of html.matchAll(/"((?:[^"\\\n]|\\.){2,}?)"\s*:\s*\[\s*"/g)) keys.add(decode(m[1]));
for (const m of html.matchAll(/'((?:[^'\\\n]|\\.){2,}?)'\s*:\s*\[\s*'/g)) keys.add(decode(m[1]));
const labelled = ["App color: ", "App color: pick your own", "Today's recap", "This week's recap", "Subtitles 0.5 seconds earlier", "Subtitles 0.5 seconds later"];
for (const k of labelled) assert(keys.has(k), 'TR_MSG row for "' + k + '"');
assert(!/setAttribute\("aria-label", "App color:/.test(html), 'no hardcoded App color aria-label');
assert(!/setAttribute\("aria-label", "Today's recap"\)/.test(html), 'no hardcoded Today recap aria-label');
assert(!/setAttribute\("aria-label", "This week's recap"\)/.test(html), 'no hardcoded Week recap aria-label');
assert(!/setAttribute\("aria-label", "Subtitles 0\.5 seconds/.test(html), 'no hardcoded subtitle sync aria-label');
// every accent dot repaints from its stored value on a language switch
assert(/accentRow\.querySelectorAll\("\.accent-dot"\)/.test(html), 'accent dots repaint on relang');

console.log('round523 select min-width cap: ok');
console.log('round523 aria-label translation: ok');

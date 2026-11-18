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

// --- Round 539 new 1: Auto PiP for local files ---
// Chip and hint sit on the Play-a-file card next to Skip silence.
assert(html.includes('id="lpAutoPipBtn539"'), 'chip element');
assert(html.includes('id="lpAutoPipHint539"'), 'hint element');
assert(html.indexOf('id="lpSilBtn"') < html.indexOf('id="lpAutoPipBtn539"'), 'chip placed after Skip silence');

// Preference: seeded off and whitelisted in the loader.
assert(html.includes('palette534: "", autoPip539: false };'), 'pref seeded off');
assert(html.includes('if (saved.autoPip539 === true) prefs.autoPip539 = true;'), 'pref whitelisted');

// Behaviour lives inside the main closure, before the boot flag.
const flagIdx = html.indexOf('window.__vpMainOk325 = true');
const behaviourIdx = html.indexOf('Round 539 new 1: Auto PiP for local files.');
assert(behaviourIdx > 0 && behaviourIdx < flagIdx, 'behaviour inside main closure');
assert(html.includes('setActionHandler("enterpictureinpicture", want ? onAuto : null)'), 'mediaSession handler armed only while wanted');
assert(html.includes('vid.addEventListener("leavepictureinpicture", function () { autoEntered = false; })'), 'hand-closed PiP resets the flag');
assert(html.includes('if (!document.hidden && autoEntered && document.pictureInPictureElement)'), 'only the self-opened window closes on return');
assert(html.includes('if (vid.paused || vid.ended || !vid.currentSrc) return;'), 'no window for a paused or missing file');
assert(html.includes('e.key !== "vp-prefs.v1" || !e.newValue'), 'other tabs follow the chip');

// Translations: chip states, hint and What's new name carry Hindi and Gujarati rows.
const trIdx = html.indexOf('"Auto PiP": ["ऑटो PiP", "ઓટો PiP"]');
assert(trIdx > 0 && trIdx < flagIdx, 'TR_MSG rows inside main closure');
// Placement regression (caught live: the blocks first landed after the main
// closure's })(); where $/prefs/TR_MSG are out of scope and the boot banner
// fired). The flag is set at top level AFTER the closure, so the rows and the
// behaviour must sit before the closure's final })();.
const closureEnd = html.lastIndexOf('})();', flagIdx);
assert(closureEnd > 0 && trIdx < closureEnd && behaviourIdx < closureEnd, 'rows and behaviour sit inside the main closure, before its end');
assert(html.includes('"\\uD83E\\uDE9F Auto PiP: off"'), 'off-state translation row');
assert(html.includes('"\\uD83E\\uDE9F Auto PiP: on"'), 'on-state translation row');

// Discovery: feature finder entry with a Hindi/Gujarati keyword row, and the
// guarded What's new listener after the flag (round 536's shape).
assert(html.includes('["Auto PiP", "auto pip picture in picture floating window'), 'feature finder entry');
assert(html.includes('__vpWnew283("Auto PiP", "#lpAutoPipBtn539")'), "What's new listener");
assert(html.indexOf('__vpWnew283("Auto PiP"') > flagIdx, "What's new listener stays after the flag");

// Round 537 + 536 regression anchors still hold.
assert(html.includes('.look-chips[hidden]{display:none}'), 'round537 hidden guard intact');
assert(html.includes('"MP3 quality choice"'), 'round536 rows intact');

console.log('round539 tests pass');

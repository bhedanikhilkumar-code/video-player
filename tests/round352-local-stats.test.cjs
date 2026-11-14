const assert=require('node:assert/strict'),fs=require('fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
// Feature block exists inside the main closure, before the main-ok flag
const bi=h.indexOf('Local file stats (round 352 new 1)');
assert.ok(bi>0,'feature block present');
assert.ok(bi<h.indexOf('window.__vpMainOk325 = true;'),'block runs before the main-ok flag');
// Overlay reuses the round-70 panel styling and the shared Stats setting
assert.ok(h.includes('ov352.className = "vp-statsov"'),'reuses .vp-statsov look');
assert.ok(h.includes('localStorage.getItem("vp-stats-ov.v1")'),'shares the Stats chip setting');
assert.ok(h.includes('ov352.id = "vpLpStatsOv352"'),'overlay id present');
// Local video element is wrapped so the panel can sit on its corner
assert.ok(h.includes('vid352.parentNode.insertBefore(wrap352, vid352)'),'video wrapped in a relative box');
// Audio files get a translated word instead of a fake 0x0 resolution
assert.ok(h.includes('T("Audio")'),'audio files labelled');
assert.ok(h.includes('"Audio": ['),'Audio translated hi/gu');
assert.ok(h.includes('"Stats over local files": ['),'feature name translated hi/gu');
// Finder + What's new registrations
assert.ok(h.includes('["Stats over local files", "local file stats resolution'),'feature finder entry');
assert.ok(h.includes('__vpWnew283("Stats over local files", "#statsBtn")'),'whats new entry');
// Buffered share is capped and guarded for streams (infinite duration)
assert.ok(h.includes('Math.min(100, Math.round(b.end(b.length - 1) / dur * 100))'),'buffered percent guarded');
// fmtT352 hour formatting behaves like the YouTube panel's
const vm=require('node:vm');
const i=h.indexOf('    function fmtT352(s) {');
const c=vm.createContext({});vm.runInContext(h.slice(i,h.indexOf('    function statsOn352',i)),c);
assert.equal(c.fmtT352(0),'0:00');assert.equal(c.fmtT352(65),'1:05');assert.equal(c.fmtT352(3723),'1:02:03');assert.equal(c.fmtT352(Infinity),'0:00');
console.log('Local file stats overlay: block, look, setting, translations, finder and whats-new all wired.');

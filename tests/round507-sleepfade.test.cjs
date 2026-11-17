// Run with node tests/round507-sleepfade.test.cjs. Static wiring checks for the
// round 507 sleep fade length choice (the browser flow is verified live).
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
// the choice row and chips exist in the markup, hidden until the fade switch is on
assert.ok(/id="sleepFadeLenRow507" hidden/.test(html),'row present and hidden by default');
assert.ok(/id="sleepFadeLenChips507"/.test(html),'chips span present');
// every fade gate uses the chosen window, none keeps the fixed minute
const gates=html.match(/leftMs\s*<=\s*fadeWin507/g)||[];assert.equal(gates.length,5,'five fade gates use the chosen window: '+gates.length);
assert.ok(!/leftMs <= 60000/.test(html),'no fixed-minute fade gate left');
assert.ok(!/leftMs \/ 60000/.test(html),'no fixed-minute fade ratio left');
// persistence: init, write, import validation, reset-all and cross-tab sync all know the key
assert.ok(/localStorage.getItem\("vp-sleep-fadelen.v1"\)/.test(html),'init reads the key');
assert.ok(/localStorage.setItem\("vp-sleep-fadelen.v1", String\(v\)\)/.test(html),'chip writes the key');
assert.ok(/"vp-sleep-fadelen.v1": \/\^\(30\|60\|120\)\$\//.test(html),'backup import validates the key');
assert.ok(/"vp-sleep-fade.v1", "vp-sleep-fadelen.v1", "vp-sleep-last.v1"/.test(html),'reset all settings clears the key');
assert.ok(/e.key !== "vp-sleep-fadelen.v1"/.test(html),'storage listener syncs the key across tabs');
// translations for the new strings live in the main closure
["Fade over:","30 sec","1 min","2 min","Fade length set to {n}.","Sleep fade length"].forEach(k=>{
 const re=new RegExp('"'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'": \\["[^\\"]+", "[^\\"]+"\\]');assert.ok(re.test(html),'translated: '+k);});
// checkbox labels name the chosen length and repaint after the static table on load
["Fade the sound out in the last {t}","Fade the picture to dark in the last {t}"].forEach(k=>{
 const re=new RegExp('"'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'": \\["[^\\"]+", "[^\\"]+"\\]');assert.ok(re.test(html),'translated: '+k);});
assert.ok(/vp-lang-done441", fadeLenPaint507/.test(html),'labels repaint after the first applyLang on load');
// finder and What's new name the feature
assert.ok(/\["Sleep fade length", "sleep fade length/.test(html),'feature finder entry');
assert.ok(/__vpWnew283\("Sleep fade length", "#sleepFade"\)/.test(html),"What's new entry");
// What's new stays capped at 10
assert.ok(/WNEW.length=Math.min\(10,WNEW.length\)/.test(html)||/WNEW\.length = Math\.min\(10/.test(html),"What's new cap intact");
// every inline script block parses
const blocks=[...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
blocks.forEach((b,i)=>{try{new vm.Script(b);}catch(e){throw new Error('script block '+i+': '+e.message);}});
console.log('round507 sleep fade length wiring OK ('+blocks.length+' script blocks parse)');

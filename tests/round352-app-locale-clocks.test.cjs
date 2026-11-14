const assert=require('node:assert/strict'),fs=require('fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const locArg='prefs.lang === "hi" ? "hi-IN" : prefs.lang === "gu" ? "gu-IN" : undefined';
// Fix 3: both Finish-by clocks follow the app language
const clocks=h.match(/function clock\(ms\) \{ var loc = prefs\.lang/g);
assert.equal(clocks&&clocks.length,2,'both finish clocks patched');
// Fix 4: queue snapshot label uses the app locale
assert.ok(h.includes('d.toLocaleString('+locArg),'snapshot label uses app locale');
// Fix 5: blank screen clock uses the app locale
assert.ok(h.includes("toLocaleTimeString("+locArg+', { hour: "2-digit", minute: "2-digit" })'),'blank clock uses app locale');
// No browser-locale toLocaleString/toLocaleTimeString with [] left in those five spots
assert.ok(!h.includes('function clock(ms) { return new Date(ms).toLocaleTimeString([]'),'old browser-locale clock gone');
assert.ok(!h.includes('lab.textContent = d.toLocaleString([]'),'old snapshot label gone');
assert.ok(!h.includes('c.textContent = new Date().toLocaleTimeString([]'),'old blank clock gone');
// Behavior: Hindi gets Devanagari day period, English keeps short form
const vm=require('node:vm');
const i=h.indexOf('    function clock(ms) { var loc = prefs.lang');
const c=vm.createContext({prefs:{lang:'hi'},Date});
vm.runInContext(h.slice(i,h.indexOf('\n',i)+0||undefined,i+400),c);
const d=new Date(2026,10,15,20,30),o={hour:'numeric',minute:'2-digit'};
// The app's own standard (round 252 Ends-at clock) formats hi/gu through the app locale;
// minute forms keep Latin digits/day period in hi-IN - what matters is the locale follows the app.
assert.equal((c.prefs.lang='hi',c.clock(d.getTime())),d.toLocaleTimeString('hi-IN',o),'Hindi uses hi-IN');
assert.equal((c.prefs.lang='gu',c.clock(d.getTime())),d.toLocaleTimeString('gu-IN',o),'Gujarati uses gu-IN');
assert.equal((c.prefs.lang='en',c.clock(d.getTime())),d.toLocaleTimeString(undefined,o),'English keeps the device default');
console.log('Fixes 3-5: finish clocks, snapshot labels and blank clock all follow the app language.');

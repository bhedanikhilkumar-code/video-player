const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
let blocks=0;
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){blocks++;new vm.Script(m[1]);}
assert.equal(blocks,79);
const flag=html.indexOf('window.__vpMainOk325 = true');
assert(flag>0,'main flag');
// The whole feature lives inside the main closure, before the boot flag.
const blockStart=html.indexOf('// Round 521 new 1: a system notification');
assert(blockStart>0&&blockStart<flag,'feature block inside the main closure');
const block=html.slice(blockStart,html.indexOf('function showDue517(r) {',blockStart));
// Device-only storage key, default off, and the chip exists before its listener is wired.
assert(block.includes('"vp-remindntf521.v1"'));
assert(html.indexOf('id="remNtf521"')<html.indexOf('getElementById("remNtf521").addEventListener'),'chip created before use');
// The notification fires only when enabled, permitted, and the page is hidden.
assert(block.includes('Notification.permission !== "granted") return'));
assert(block.includes('if (!document.hidden) return;'));
assert(block.includes('tag: "vp-remind517-" + r.id'));
assert(block.includes('window.focus()'));
// Permission is only ever requested from the chip tap, never on load.
assert(block.includes('Notification.requestPermission()'));
assert.equal(block.split('Notification.requestPermission()').length-1,1,'asked once, on tap');
// Turning the chip off closes any posted notification; so does dismissing the card.
assert(block.includes('ntfSet521(false); paintNtf521(); ntfClose521();'));
const hide=html.slice(html.indexOf('function hideDue517()'));
assert(hide.startsWith('function hideDue517() { if (due517) due517.hidden = true; showing517 = null; titleAlertClear519(); ntfClose521(); }'),'hide closes the notification');
// Only a fresh card notifies - a language repaint of an already-showing card stays quiet.
const show=html.slice(html.indexOf('function showDue517(r) {'),html.indexOf('// Round 517 fix 2:'));
assert(show.includes('if (fresh519) { chime519(); notify521(r); }'));
// The choice rides no backup: the key joins neither export list.
const exp=html.slice(html.indexOf('// Round 509'),0)||'';
for(const m of html.matchAll(/\["vp-lp\.v1",[\s\S]*?\]\.forEach/g))assert(!m[0].includes('vp-remindntf521'),'device choice stays out of backups');
// New UI strings are translated inside the main closure.
for(const s of ['"Reminder notification"','"Reminder notification: on"','"Reminder notification: off"','"Reminder notifications off."','"Notifications allowed. You will get one alert when a reminder is due."']){
  const i=html.indexOf(s);assert(i>0&&i<flag,s+' translated inside the main closure');
}
// What is new entry staggers past every earlier reminder entry and the name resolves.
const wn=html.indexOf('__vpWnew283("Reminder notification", "#remindCard517"); }, 16220);');
assert(wn>0&&wn<flag,'whats new entry before the flag');
assert(wn>html.indexOf('__vpWnew283("Reminder sound", "#remindCard517"); }, 16120);'),'staggered past 16120');
// ntfOn521 defaults to off and honours the stored flag.
const fn=vm.runInNewContext('(function ntfOn521() { try { return localStorage.getItem("vp-remindntf521.v1") === "1"; } catch (e) { return false; } })');
assert.equal(typeof fn,'function');
console.log('round521 reminder notification wiring: ok');
// Round 521 fix 1 regression: the due card's Play button must use this closure's own
// queue functions - the cross-closure playId call threw ReferenceError on every tap live.
const playH=html.slice(html.indexOf('getElementById("remDuePlay517").addEventListener'),html.indexOf('getElementById("remDueSnz517").addEventListener'));
assert(!playH.includes('playId('),'no cross-closure playId call');
assert(playH.includes('playQueueAt(qi521)'),'plays through the queue');
assert(playH.includes('lib.queue.length >= 50'),'queue-full guard');
assert(playH.indexOf('lib.queue.length >= 50')<playH.indexOf('write517(read517().filter'),'capacity checked before the reminder is removed');
console.log('round521 reminder Play regression: ok');

// Run with node tests/round520-remind-cue-wiring.test.cjs. Static wiring and helper
// behaviour checks for the watch reminder (rounds 517-519) and the YouTube cue sheet
// (round 514), matching the flows verified live in round 520: a reminder set for a
// near-future clock time fires its due card in every open tab with the alarm tab
// title, dismiss in one tab closes the rest and clears storage, and an armed cue
// sheet applies a speed cue as the playhead crosses its time.
const fs = require('node:fs'), assert = require('node:assert/strict'), vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');

// --- watch reminder wiring ---
assert.ok(/var KEY517 = "vp-remind517\.v1", MAX517 = 5;/.test(html), 'reminder key and 5-reminder cap');
const backupArrays = html.match(/\["vp-lp\.v1"[\s\S]*?"vp-remind517\.v1"\]/g) || [];
assert.equal(backupArrays.length, 2, 'vp-remind517.v1 rides both the export and the import settings key lists');
assert.ok(backupArrays[0].indexOf('"vp-ytcues.v1"') >= 0, 'vp-ytcues.v1 rides the same backup lists');
assert.ok(/if\(k==="vp-remind517\.v1"\)s\[k\]=window\.__vpCleanRemind517\(s\[k\]\)/.test(html), 'import validates reminders through the live cleaner');
assert.ok(/if\(k==="vp-remind517\.v1"\)document\.dispatchEvent\(new Event\("vp-remind517-change"\)\)/.test(html), 'a restored reminder repaints the card');
assert.ok(/e\.key === KEY517 \|\| e\.key === null/.test(html), 'cross-tab storage event reconciles reminders');
// round 519 tab-title alert: leads with the alarm marker only while the due card is up,
// and restores the old title only if the alert text is still there
assert.ok(/document\.title = want/.test(html), 'due reminder leads the tab title');
assert.ok(/indexOf\("\\u23f0 "\) === 0/.test(html), 'old title restored only while the alarm marker is still showing');
// the chime on/off choice is a device choice and must stay out of both backup lists
assert.ok(/var SND519 = "vp-remindsnd519\.v1"/.test(html), 'chime key exists');
backupArrays.forEach(function (a) { assert.ok(a.indexOf('vp-remindsnd519') < 0, 'chime choice stays on this device, out of backups'); });

// --- translations live in the main closure for the reminder surface ---
['Watch reminder', 'Reminder sound: on', 'Reminder sound: off', 'Reminder shows in the tab title',
 'Schedule a watch date', 'Snooze 1 hour', 'Not now', 'This video already has a reminder at that time.',
 'You can keep 5 reminders. Cancel one first.'].forEach(function (k) {
  const re = new RegExp('"' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '": \\["[^\\"]+", "[^\\"]+"\\]');
  assert.ok(re.test(html), 'translated: ' + k);
});
// feature finder and What's new name the round 517-519 additions
assert.ok(/\["Watch reminder", "watch reminder/.test(html), 'feature finder entry: Watch reminder');
assert.ok(/\["Reminder sound", "reminder chime/.test(html), 'feature finder entry: Reminder sound');
assert.ok(/__vpWnew283\("Watch reminder", "#remindCard517"\)/.test(html), "What's new entry: Watch reminder");
assert.ok(/WNEW\.length ?[:=]|Math\.min\(10/.test(html), "What's new cap logic intact");

// --- helper behaviour, run against the real source ---
function grabFn(name) {
  const start = html.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name + ' must exist');
  let depth = 0, i = html.indexOf('{', start);
  for (let j = i; j < html.length; j++) {
    if (html[j] === '{') depth++;
    else if (html[j] === '}') { depth--; if (depth === 0) return html.slice(start, j + 1); }
  }
  throw new Error(name + ': unbalanced');
}
// clean517: the cleaner every read, save, import and cross-tab reconcile goes through
const ctx = vm.createContext({ MAX517: 5, Date: Date, Number: Number, Array: Array, JSON: JSON, Math: Math });
vm.runInContext(grabFn('clean517'), ctx);
const now = Date.now();
const good = { id: 'dQw4w9WgXcQ', title: 'Rick Astley', at: now + 3600e3 };
assert.equal(ctx.clean517([good]).length, 1, 'a valid reminder survives cleaning');
assert.equal(ctx.clean517([{ id: '!!bad!!', at: now + 1e3 }]).length, 0, 'a bad video id is dropped');
assert.equal(ctx.clean517([{ id: 'dQw4w9WgXcQ', at: now - 8 * 864e5 }]).length, 0, 'a reminder over a week old is dropped');
assert.equal(ctx.clean517([{ id: 'dQw4w9WgXcQ', at: now + 31 * 864e5 }]).length, 0, 'a reminder over 30 days out is dropped');
assert.equal(ctx.clean517([good, good]).length, 1, 'the same video at the same time is stored once');
assert.equal(ctx.clean517(Array.from({ length: 8 }, function (_, i) { return { id: 'dQw4w9WgXcQ', title: 'x', at: now + (i + 1) * 6e4 }; })).length, 5, 'no more than 5 reminders are kept');
assert.equal(ctx.clean517([{ id: 'dQw4w9WgXcQ', title: 42, at: now + 1e3 }])[0].title, '', 'a non-string title becomes empty');
assert.equal(ctx.clean517('junk').length, 0, 'non-array storage reads as no reminders');
// conflict514: one pause or jump per cue time (the round-513 rule), other actions may share a time
const ctx2 = vm.createContext({ Math: Math });
vm.runInContext(grabFn('conflict514'), ctx2);
const at = function (t, action) { return { name: 'c', time: t, action: action, value: 1 }; };
assert.equal(ctx2.conflict514([at(5, 'pause'), at(5, 'pause')]), true, 'two pauses at one time conflict');
assert.equal(ctx2.conflict514([at(5, 'pause'), at(5, 'seek')]), true, 'a pause and a jump at one time conflict');
assert.equal(ctx2.conflict514([at(5, 'seek'), at(5, 'seek')]), true, 'two jumps at one time conflict');
assert.equal(ctx2.conflict514([at(5, 'rate'), at(5, 'volume')]), false, 'speed and volume may share a time');
assert.equal(ctx2.conflict514([at(5, 'rate'), at(5, 'pause')]), false, 'a speed change may share the pause time');
assert.equal(ctx2.conflict514([at(5, 'pause'), at(6, 'pause')]), false, 'pauses at different times are fine');

// every inline script block parses
const blocks = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(function (m) { return m[1]; });
blocks.forEach(function (b, i) { try { new vm.Script(b); } catch (e) { throw new Error('script block ' + i + ': ' + e.message); } });
console.log('round520 reminder + YouTube cue wiring OK (' + blocks.length + ' script blocks parse)');

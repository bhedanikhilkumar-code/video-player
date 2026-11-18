// Round 441 fix: the Tidy list is rebuilt after the whole language pass finishes.
// Round 528: the old test counted every occurrence of the event name and expected
// exactly 3 (two dispatches + the Tidy listener). Round 507 added a second, valid
// listener (the sleep-fade labels repaint on the same event), so the bare count is
// no longer a contract. Assert the real contract instead: the event is dispatched
// exactly twice (sync + batched) and the Tidy list still consumes it.
const fs=require('fs'),assert=require('node:assert/strict');
const s=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const disp=(s.match(/dispatchEvent\(new Event\("vp-lang-done441"\)/g)||[]).length;
assert.equal(disp,2,'vp-lang-done441 must be dispatched exactly twice (sync + batched), got '+disp);
assert.ok(/addEventListener\("vp-lang-done441",\s*function\s*\(\s*\)\s*\{\s*apply\(\);\s*paint\(\);/.test(s),'the Tidy list must still rebuild on vp-lang-done441');
const cons=(s.match(/addEventListener\("vp-lang-done441"/g)||[]).length;
assert.ok(cons>=1,'at least one consumer, got '+cons);
console.log('PASS: vp-lang-done441 dispatched (sync + batched) and consumed by the Tidy list ('+cons+' consumers)');

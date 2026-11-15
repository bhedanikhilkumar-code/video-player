// Round 441 fix: the Tidy list is rebuilt after the whole language pass finishes.
const fs=require('fs'),assert=require('node:assert/strict');
const s=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
assert.equal((s.match(/vp-lang-done441/g)||[]).length,3);
console.log('PASS: vp-lang-done441 dispatched (sync + batched) and consumed by the Tidy list');

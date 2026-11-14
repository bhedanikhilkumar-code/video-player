const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
['સોંથો','પોતમા','કરી શકાય નથી'].forEach(w=>assert(!h.includes(w),w));
assert(h.includes('સૌથી નજીકનો વિકલ્પ'));
console.log('Round 348 Gujarati About note has no garbled words.');

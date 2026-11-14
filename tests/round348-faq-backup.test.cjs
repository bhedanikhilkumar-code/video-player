const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/Your videos (में|માં) 'Export backup'/.test(h));
assert(h.includes("'बैकअप निकालें'")&&h.includes("'બેકઅપ કાઢો'"));
console.log('Round 348 storage FAQ names the backup buttons as Hindi/Gujarati users see them.');

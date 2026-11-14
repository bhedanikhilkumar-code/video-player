const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/और Mono भी|અને Mono પણ|Hall (और|અને) Wide/.test(h));
assert(h.includes('मोनो साउंड भी')&&h.includes('હૉલ સાઉન્ડ અને વાઇડ સાઉન્ડ'));
console.log('Round 348 Dialogue boost hint names Mono, Hall and Wide as their buttons read.');

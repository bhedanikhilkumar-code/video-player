const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/'Play a file' (कार्ड|કાર્ડ)/.test(h),'FAQ must name the card by its translated heading');
assert(h.includes("'फ़ाइल चलाएं (वॉल्यूम बूस्ट)' कार्ड में"));
assert(h.includes("'ફાઇલ ચલાવો (વોલ્યુમ બૂસ્ટ)' કાર્ડમાં"));
console.log('Round 348 FAQ volume answer names the file card in Hindi and Gujarati.');

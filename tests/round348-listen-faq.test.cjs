const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/Listening help (कार्ड|કાર્ડ)/.test(h)&&!/steps (और|અને) screen-off/.test(h));
assert(h.includes('>सुनने की मदद</a> कार्ड')&&h.includes('>સાંભળવાની મદદ</a> કાર્ડ'));
console.log('Round 348 listening FAQ links to the card by its translated name.');

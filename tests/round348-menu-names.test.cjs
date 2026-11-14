const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/और Help दिखता|અને Help દેખાય|Help - Report a problem (से|થી)/.test(h)&&!/Your videos, (डाउनलोडर|ડાઉનલોડર)/.test(h));
assert(h.includes('मदद - समस्या की रिपोर्ट करें')&&h.includes('મદદ - સમસ્યાની જાણ કરો'));
console.log('Round 348 Simple mode hint and start-failure note use the translated section names.');

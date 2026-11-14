const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/(?:[\u0900-\u097F\u0A80-\u0AFF]["' ][^"\n]*|"[^"\n]*)Load video (?:दबाएं|દબાવો)/.test(h),'no Indic text may name the Load button in English');
assert(h.includes('वीडियो चलाएं दबाएं')&&h.includes('વીડિયો ચલાવો દબાવો'));
console.log('Round 348 Hindi/Gujarati help names the Load button as shown.');

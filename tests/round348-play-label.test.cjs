const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!/(?:पर|में|बाद|से पहले|पहले|लिए) Play (?:दबाएं|दबाने|कुछ)/.test(h)&&!/Play (?:દબાવો|દબાવતાં|થોડી)/.test(h));
console.log('Round 348 Hindi/Gujarati hints name the Play button as shown.');

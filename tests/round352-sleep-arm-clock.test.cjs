const assert=require('node:assert/strict'),fs=require('fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
// Auto sleep timer chips must follow the app language, not hardcoded English am/pm.
const i=h.indexOf('    function hourTxt(h) {\n      var loc = prefs.lang');assert(i>0,'new hourTxt found');
const c=vm.createContext({prefs:{lang:'hi'},Date});vm.runInContext(h.slice(i,h.indexOf('\n    function paint()',i)),c);
const hi=c.hourTxt(20),gu=(c.prefs.lang='gu',c.hourTxt(20)),hiMid=c.hourTxt(0),en=(c.prefs.lang='en',c.hourTxt(20)),enMid=c.hourTxt(0);
assert.ok(!/pm|am/.test(hi),'Hindi chip has no English am/pm: '+hi);
assert.ok(!/pm|am/.test(gu),'Gujarati chip has no English am/pm: '+gu);
assert.ok(!/am/.test(hiMid),'Hindi midnight has no English am: '+hiMid);
assert.equal(en,'8 pm','English keeps short form: '+en);
assert.equal(enMid,'12 am','English midnight keeps short form: '+enMid);
assert.ok(/[\u0A80-\u0AFF]/.test(gu),'Gujarati chip uses Gujarati letters: '+gu);
console.log('Auto sleep timer chips read रात 8 / 8 રાત્રે in Hindi and Gujarati, 8 pm in English.',{hi,gu,hiMid,en,enMid});

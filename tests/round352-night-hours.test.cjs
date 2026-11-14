const assert=require('node:assert/strict'),fs=require('fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const i=h.indexOf('    function nhLabel273(hr) {\n      var loc = prefs.lang');assert(i>0,'new nhLabel273 found');
const c=vm.createContext({prefs:{lang:'hi'},Date});vm.runInContext(h.slice(i,h.indexOf('\n    var nhPaint273',i)),c);
const hi=c.nhLabel273(19),gu=(c.prefs.lang='gu',c.nhLabel273(5)),en=(c.prefs.lang='en',c.nhLabel273(19)),en5=c.nhLabel273(5);
assert.ok(!/am|pm/.test(hi),'Hindi night hour not English: '+hi);
assert.ok(!/am|pm/.test(gu),'Gujarati morning hour not English: '+gu);
assert.equal(en,'7pm','English evening keeps short form: '+en);
assert.equal(en5,'5am','English morning keeps short form: '+en5);
console.log('Night hours chips read in the app language:',{hi,gu,en,en5});

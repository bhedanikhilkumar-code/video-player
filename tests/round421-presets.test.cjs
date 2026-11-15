const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');const s=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const start=s.indexOf('  function cleanCircuitPresets421('),end=s.indexOf('  // Round 421: compose',start);const c=vm.createContext({validPracticeLoop:x=>x&&typeof x.name==='string'&&x.name.trim()&&typeof x.a==='number'&&Number.isFinite(x.a)&&x.a>=0&&typeof x.b==='number'&&Number.isFinite(x.b)&&x.b>x.a&&x.b<=604800});vm.runInContext(s.slice(start,end),c);
const good={key:'test1',video:'dQw4w9WgXcQ',name:'Routine',steps:[{name:'Solo',a:5,b:10,passes:2}]};const clean=x=>JSON.parse(JSON.stringify(c.cleanCircuitPresets421(x)));
assert.deepEqual(clean([good]),[good]);for(const bad of [null,{},'x'])assert.deepEqual(clean(bad),[]);
for(const changes of [{video:'bad'},{key:'<svg>'},{name:''},{steps:[]},{steps:[{name:'No',a:10,b:5,passes:1}]},{steps:[{name:'No',a:5,b:10,passes:1.5}]},{steps:[{name:'No',a:5,b:10,passes:21}]}])assert.equal(clean([{...good,...changes}]).length,0);
assert.equal(clean([good,good,{...good,key:'other',name:'routine'}]).length,1);
assert.equal(clean(Array.from({length:25},(_,i)=>({...good,key:'key'+i,name:'R'+i}))).length,20);
assert.equal((s.match(/"vp-circuit-presets421.v1"/g)||[]).length>=4,true);assert.match(s,/if\(k==="vp-circuit-presets421.v1"\)s\[k\]=cleanCircuitPresets421\(s\[k\]\)/);
console.log('Circuit preset validation: malformed IDs, duplicate names, invalid spans/pass counts, 20 cap and backup cleaner guards pass.');

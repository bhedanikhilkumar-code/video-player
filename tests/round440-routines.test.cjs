const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const context=vm.createContext({});
for(const [start,end] of [['  function intervalPlan419(','  // Round 440: interval routines'],['  function cleanIntervalRoutines440(','  Object.assign(TR_MSG, {']]){const a=src.indexOf(start),b=src.indexOf(end,a);assert.ok(a>=0&&b>a);vm.runInContext(src.slice(a,b),context);}
const good={key:'routine-1',name:'Warmup',work:40,rest:20,prepare:10,rounds:6,sound:true};
const clean=value=>JSON.parse(JSON.stringify(context.cleanIntervalRoutines440(value)));
assert.deepEqual(clean([good]),[good]);
for(const change of [{key:'<bad>'},{name:' '},{work:4},{work:3601},{work:'40'},{work:4.5},{rest:-1},{prepare:61},{rounds:0},{rounds:100},{sound:'true'}])assert.deepEqual(clean([{...good,...change}]),[]);
for(const value of [null,{},'x',10])assert.deepEqual(clean(value),[]);
assert.equal(clean([good,good,{...good,key:'other',name:'WARMUP'}]).length,1);
assert.equal(clean(Array.from({length:50},(_,i)=>({...good,key:'r-'+i,name:'R '+i}))).length,20);
assert.equal(clean([{...good,name:'\u0000  Warmup\n\u0000'}])[0].name,'Warmup');
assert.ok((src.match(/"vp-interval-routines440.v1"/g)||[]).length>=5);
assert.match(src,/if\(k==="vp-interval-routines440.v1"\)s\[k\]=cleanIntervalRoutines440\(s\[k\]\)/);
console.log('PASS: routine shape, numeric ranges, integer/type checks, clean names, duplicate keys/names, cap and backup validation.');

const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),wave=require('./round555-wav.test.cjs');const code=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').split('// WAV-SAMPLES555 START')[1].split('// WAV-SAMPLES555 END')[0],ctx={window:{},setTimeout,DataView,Array,Number,Math,Error};vm.runInNewContext(code,ctx);const scan=ctx.window.VPWavSamples555.scan;
function fixture(){return wave({values:[[.25,.25,.25,-.5,-.5,-.5,0,1/32768],[.25,.5,.25,.5,.25,.5,.25,.5]]});}module.exports=fixture;
const run=async values=>(await scan(new Blob([wave({bits:32,float:true,channels:1,frames:values.length,values:[values]})]))).stats[0];
const shape=s=>[s.repeatRuns,s.repeatSamples,s.repeatLongest,s.repeatFirst,s.repeatFirstValue,s.repeatTies];
if(require.main===module){
test('maximal runs include first/trailing and tie keeps earliest value',async()=>{const s=await run([.25,.25,.25,-.5,-.5,-.5,0,.75,.75]);assert.deepEqual(shape(s),[3,8,3,0,.25,2]);});
test('singletons and invalid-only channel have no runs',async()=>{for(const v of [[1,2,3],[NaN,Infinity,-Infinity],[.25]])assert.deepEqual(shape(await run(v)),[0,0,0,null,null,0]);});
test('signed zeros are one equal run and constant overrange participates',async()=>{assert.deepEqual(shape(await run([0,-0,0])),[1,3,3,0,0,1]);assert.deepEqual(shape(await run([2,2,2,2])),[1,4,4,0,2,1]);});
test('nonfinite separates even identical neighbors without bridging',async()=>{assert.deepEqual(shape(await run([.5,.5,NaN,.5,.5,Infinity,.5,-Infinity,.5])),[2,4,2,0,.5,2]);});
test('tiny finite unequal float values are not tolerance merged',async()=>{const a=Math.fround(1e-30),b=Math.fround(1.000001e-30);assert.notEqual(a,b);assert.equal((await run([a,b,a,b])).repeatRuns,0);});
test('all integer encodings keep channel boundaries separate and bytes unchanged',async()=>{for(const bits of [8,16,24,32]){const b=wave({bits,frames:6,values:[[.25,.25,.5,.5,.5,0],[-.5,0,.5,0,.5,0]]}),copy=Buffer.from(b),r=await scan(new Blob([b]));assert.deepEqual(shape(r.stats[0]),[2,5,3,2,.5,1]);assert.equal(r.stats[1].repeatRuns,0);assert.deepEqual(b,copy);}});
test('constant run crosses read blocks as one and cancellation still rejects',async()=>{const b=wave({frames:100000,channels:1,values:[[.5]]}),r=await scan(new Blob([b]));assert.deepEqual(shape(r.stats[0]),[1,100000,100000,0,.5,1]);let reads=0;const blob=new Blob([b]);await assert.rejects(scan({size:b.length,slice(a,b){reads++;return blob.slice(a,b);}},()=>reads>=6),/cancelled/);});
}

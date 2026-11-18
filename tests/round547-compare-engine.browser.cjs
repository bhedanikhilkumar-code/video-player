const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p})=>{
 const results=await p.evaluate(async()=>{
  const results=[];
  for(const original of [false,true]){
   const ctx=new OfflineAudioContext(2,48000,48000),src=ctx.createBufferSource(),buf=ctx.createBuffer(2,48000,48000),processed=ctx.createGain();
   buf.getChannelData(0).fill(.4);buf.getChannelData(1).fill(-.2);src.buffer=buf;processed.gain.value=.25;src.connect(processed);
   const compare=VPSoundCompare547.create(ctx,src,processed);compare.output.connect(ctx.destination);compare.set(original);src.start();const out=await ctx.startRendering();results.push({original,left:out.getChannelData(0)[24000],right:out.getChannelData(1)[24000],active:compare.active()});
  }
  return results;
 });
 for(const r of results){assert.equal(r.active,r.original);assert.ok(Math.abs(r.left-(r.original?.4:.1))<1e-6);assert.ok(Math.abs(r.right-(r.original?-.2:-.05))<1e-6);}
 console.log('PASS complete sound A/B: original bypass and processed path render correctly with stereo polarity preserved');
}).catch(e=>{console.error(e);process.exitCode=1;});

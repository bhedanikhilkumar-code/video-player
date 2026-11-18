const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p})=>{
 const results=await p.evaluate(async()=>{
  const results=[];
  for(const level of [.02,.9,2])for(const mode of ['off','gentle','strong','invalid']){
   const ctx=new OfflineAudioContext(2,48000,48000),src=ctx.createBufferSource(),buf=ctx.createBuffer(2,48000,48000);
   for(let c=0;c<2;c++)for(let i=0;i<48000;i++)buf.getChannelData(c)[i]=level*Math.sin(2*Math.PI*440*i/48000)*(c===0?1:.5);
   src.buffer=buf;const effect=VPPeakSoftener547.create(ctx,src,mode);effect.output.connect(ctx.destination);src.start();const out=await ctx.startRendering();
   const rms=c=>Math.sqrt(out.getChannelData(c).slice(24000).reduce((s,x)=>s+x*x,0)/24000);
   results.push({level,mode,actual:effect.mode(),left:rms(0),right:rms(1),reduction:effect.reduction()});
  }
  return results;
 });
 for(const r of results){
  assert.ok(Number.isFinite(r.left)&&r.left>0,JSON.stringify(r));assert.ok(Math.abs(r.left/r.right-2)<.001,'stereo balance preserved');
  if(r.mode==='off'||r.mode==='invalid'){assert.ok(Math.abs(r.left-r.level/Math.sqrt(2))<1e-5,'off is sample-transparent');assert.equal(r.actual,'off');assert.equal(r.reduction,0);}
  else if(r.level===2){const dry=results.find(x=>x.level===2&&x.mode==='off');assert.ok(r.left<dry.left*.6,'loud peaks reduced');assert.ok(r.reduction>3,'reports real gain reduction');}
 }
 const gentle=results.find(x=>x.level===2&&x.mode==='gentle'),strong=results.find(x=>x.level===2&&x.mode==='strong');assert.ok(strong.left<gentle.left,'strong compresses more');
 console.log('PASS peak softener: 12 offline audio renders, transparent bypass, stereo preservation, loud reduction, invalid-mode fallback');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p,errors})=>{
 const data=await p.evaluate(async()=>{
  async function render(mode,hz,side=0){const rate=48000,n=rate,ctx=new OfflineAudioContext(2,n,rate),buffer=ctx.createBuffer(2,n,rate);for(let i=0;i<n;i++)buffer.getChannelData(side)[i]=.4*Math.sin(2*Math.PI*hz*i/rate);const src=ctx.createBufferSource();src.buffer=buffer;const fx=VPCrossfeed554.create(ctx,src,mode);fx.output.connect(ctx.destination);src.start();const out=await ctx.startRendering();const rms=c=>{const a=out.getChannelData(c);let s=0;for(let i=rate/2;i<n;i++)s+=a[i]*a[i];return Math.sqrt(s/(n-rate/2));};let error=0;if(mode==='off')for(let i=0;i<n;i++)error=Math.max(error,Math.abs(out.getChannelData(side)[i]-buffer.getChannelData(side)[i]));return {left:rms(0),right:rms(1),error};}
  const results={};for(const mode of ['off','light','medium'])for(const hz of [100,5000])results[mode+hz]=await render(mode,hz);results.right=await render('medium',100,1);return results;
 });
 const input=.4/Math.sqrt(2);for(const hz of [100,5000]){assert.ok(data['off'+hz].error<1e-7,'off is exact dry source');assert.equal(data['off'+hz].right,0);assert.ok(Math.abs(data['medium'+hz].left/input-.76)<.001);assert.ok(Math.abs(data['light'+hz].left/input-.88)<.001);}
 assert.ok(Math.abs(data.medium100.right/input-.24)<.002);assert.ok(Math.abs(data.light100.right/input-.12)<.002);assert.ok(data.medium5000.right<data.medium100.right*.025,'opposite high frequencies filtered >32dB');assert.ok(Math.abs(data.right.right-data.medium100.left)<1e-7);assert.ok(Math.abs(data.right.left-data.medium100.right)<1e-7);
 assert.deepEqual(errors,[]);console.log('PASS rendered crossfeed: exact Off,12/24% filtered opposite+88/76% dry,100Hz vs5kHz lowpass, symmetric right-to-left, no source boost');
}).catch(e=>{console.error(e);process.exitCode=1;});

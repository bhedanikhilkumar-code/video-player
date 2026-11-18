const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('// Round 548: bounded'),end=html.indexOf('// End quiet engine 548',start);assert.ok(start>0&&end>start);
const context={window:{},setTimeout};vm.createContext(context);vm.runInContext(html.slice(start,end),context);
const api=context.window.VPQuietMap548;
(async()=>{
 const rate=1000,n=8000,left=new Float32Array(n),right=new Float32Array(n);
 // Sound at 0-1, right-channel-only sound at 3-4, sound at 6-7.
 for(let i=0;i<n;i++){if(i<1000||(i>=6000&&i<7000))left[i]=.1;if(i>=3000&&i<4000)right[i]=.1;}
 const b={duration:8,length:n,sampleRate:rate,numberOfChannels:2,getChannelData:c=>c?right:left};
 const map=await api.envelope(b);assert.equal(map.bins.length,400);
 assert.deepEqual(JSON.parse(JSON.stringify(api.gaps(map,-40,1))),[{start:1,end:3},{start:4,end:6},{start:7,end:8}]);
 assert.equal(api.gaps(map,-40,2).length,2);assert.equal(api.gaps(map,0,1).length,0);
 let called=0;await assert.rejects(api.envelope(b,()=>++called>10),/cancelled/);
 await assert.rejects(api.envelope({...b,duration:302}),/limits/);
 left[2000]=NaN;const invalid=await api.envelope(b);assert.ok(invalid.bins[100]>.01,'nonfinite input cannot be marked silent');
 assert.equal(api.gaps({bins:[0],step:.02,duration:.01},-50,.5).length,0);
 const clips=api.listeningClips(map,-40,1);assert.equal(clips.length,3);assert.equal(clips[0].start,0);assert.equal(clips[0].end,1.2);assert.equal(clips[1].start,2.8);assert.equal(clips[1].end,4.2);assert.equal(clips[2].start,5.8);assert.equal(clips[2].end,7.2);
 const silent={bins:Array(100).fill(0),step:.02,duration:2};assert.equal(api.listeningClips(silent,-40,1).length,0);
 const short={bins:Array(100).fill(0),step:.02,duration:2};short.bins[50]=.5;const kept=api.listeningClips(short,-40,.5);assert.equal(kept.length,1);assert.ok(kept[0].end-kept[0].start>=.5,'short audible sections are preserved');
 console.log('PASS quiet map engine: all channels, 20ms boundaries, trailing gaps, thresholds, minimum length, invalid samples, cancellation and duration limits');
})().catch(e=>{console.error(e);process.exitCode=1;});

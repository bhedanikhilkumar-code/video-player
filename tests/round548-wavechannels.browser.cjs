const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.evaluate(()=>{AudioContext.prototype.decodeAudioData=function(_,done){const b=this.createBuffer(6,12000,12000);b.getChannelData(2).fill(.6);queueMicrotask(()=>done(b));return Promise.resolve(b);};});
 await p.locator('#lpFile').setInputFiles(fixture);await p.waitForFunction(()=>window.__vpWavePeaks309&&window.__vpWavePeaks309());
 const peak=await p.evaluate(()=>Math.max(...window.__vpWavePeaks309()));if(process.env.VP_BASELINE){console.log('BASELINE waveform peak with centre-channel-only audio:',peak);assert.equal(peak,0);return;}
 assert.ok(peak>.3,'centre/surround channels must appear in the waveform and loudest-part search');assert.ok(peak<=1);assert.deepEqual(errors,[]);
 console.log('PASS multichannel waveform: centre-only sound produces nonzero peaks, bounded to one');
}).catch(e=>{console.error(e);process.exitCode=1;});

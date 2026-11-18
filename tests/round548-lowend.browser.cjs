const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.evaluate(()=>{window.__decodeCalls548=0;const original=AudioContext.prototype.decodeAudioData;AudioContext.prototype.decodeAudioData=function(...a){window.__decodeCalls548++;return original.apply(this,a);};});
 if(await p.locator('#help').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#help .sec-toggle').click();
 await p.locator('#a11yLow').check();await p.locator('#lpFile').setInputFiles(fixture);await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);await p.waitForTimeout(300);
 const low=await p.evaluate(()=>__decodeCalls548);if(process.env.VP_BASELINE){console.log('BASELINE hidden waveform decode calls in Low-end mode:',low);assert.ok(low>0);return;}
 assert.equal(low,0,'Low-end mode must not allocate a second decoded audio buffer for a hidden waveform');
 await p.locator('#a11yLow').uncheck();await p.waitForFunction(()=>window.__decodeCalls548===1&&window.__vpWavePeaks309());
 await p.locator('#a11yLow').check();await p.locator('#a11yLow').uncheck();await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>__decodeCalls548),1,'already cached waveform is not decoded again');
 assert.ok(await p.locator('#lpWaveCvs287').evaluate(e=>e.width>0));assert.deepEqual(errors,[]);
 console.log('PASS low-end waveform: no hidden decode, lazy restore, cached toggles and visible canvas');
}).catch(e=>{console.error(e);process.exitCode=1;});

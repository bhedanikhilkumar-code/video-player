const assert=require('node:assert/strict'),fs=require('node:fs');
require('./round538-harness.cjs')(async({p,boot,errors})=>{
 await p.locator('#lpFile').setInputFiles(require('./round543-fixture.cjs')());await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));await p.locator('#lpVideo').evaluate(v=>{v.loop=true;v.currentTime=2.5;return v.play();});await p.locator('#spectrogram550 summary').click();
 // Verify branch observes a real signal and does not create another media source.
 await p.locator('#sgStart550').click();await p.waitForFunction(()=>window.__vpSpectrogram550().count>=4);
 let s=await p.evaluate(()=>window.__vpSpectrogram550());assert.equal(s.running,true);const peak=Math.max(...s.latest.levels);assert.ok(peak>-50,'audible tone is visible');
 // Use continuous stereo, not the quiet-navigator fixture: slow clicks could hit
 // its 2-4s silent interval. Also verify both real source tones, not any loud bin.
 for(const tone of [440,880]){const energy=Math.max(...s.latest.levels.filter((_,i)=>Math.abs(80*Math.pow(s.ceiling/80,i/127)-tone)<tone*.08));assert.ok(energy>-50,'continuous '+tone+'Hz source tone is visible');}
 await p.locator('#sgFreeze550').click();s=await p.evaluate(()=>window.__vpSpectrogram550());const frozen=s.count;assert.equal(s.running,false);await p.waitForTimeout(250);assert.equal((await p.evaluate(()=>window.__vpSpectrogram550())).count,frozen);
 await p.locator('#sgFrequency550').fill('64');await p.locator('#sgSample550').fill('0');assert.match(await p.locator('#sgInspect550').textContent(),/Sample 1 at video/);
 const dl=await Promise.all([p.waitForEvent('download'),p.locator('#sgSave550').click()]);const b=fs.readFileSync(await dl[0].path());assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),600);assert.equal(b.readUInt32BE(20),276);
 await p.locator('#sgStart550').click();await p.waitForFunction(()=>window.__vpSpectrogram550().running);await p.locator('#lpVideo').evaluate(v=>v.pause());await p.waitForFunction(()=>!window.__vpSpectrogram550().running);const paused=await p.evaluate(()=>window.__vpSpectrogram550().count);await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForTimeout(250);assert.equal((await p.evaluate(()=>window.__vpSpectrogram550())).count,paused,'resume is explicit');
 await p.locator('#sgStart550').click();await p.waitForFunction(()=>window.__vpSpectrogram550().running);await p.locator('#spectrogram550 summary').click();await p.waitForFunction(()=>!window.__vpSpectrogram550().running);await p.locator('#spectrogram550 summary').click();
 await p.locator('#sgClear550').click();assert.equal((await p.evaluate(()=>window.__vpSpectrogram550())).count,0);assert.equal(await p.locator('#sgSave550').isDisabled(),true);
 // A stronger known oscillator stays dominant over the continuous source tones.
 // Verify logarithmic bin mapping without depending on the file entering silence.
 await p.evaluate(()=>{const ctx=window.__lpCtx;window.__osc550=ctx.createOscillator();window.__gain550=ctx.createGain();__gain550.gain.value=.3;__osc550.frequency.value=1000;__osc550.connect(__gain550);__gain550.connect(window.__lpOutput276);__osc550.start();});
 await p.locator('#sgStart550').click();await p.waitForFunction(()=>window.__vpSpectrogram550().count>=4);await p.locator('#sgFreeze550').click();s=await p.evaluate(()=>window.__vpSpectrogram550());const k=s.latest.levels.indexOf(Math.max(...s.latest.levels)),hz=80*Math.pow(s.ceiling/80,k/127);assert.ok(Math.abs(hz-1000)<70,'1kHz peak '+hz);
 await p.evaluate(()=>{__osc550.stop();__osc550.disconnect();__gain550.disconnect();});
 await p.locator('#sgStart550').click();await p.locator('#lpVideo').evaluate(v=>v.currentTime=4);await p.waitForFunction(()=>!window.__vpSpectrogram550().running);
 await p.locator('#lpFile').setInputFiles({name:'Replacement.wav',mimeType:'audio/wav',buffer:fs.readFileSync(require('./round543-fixture.cjs')())});await p.waitForFunction(()=>window.__vpSpectrogram550().count===0);await p.locator('#lpVideo').evaluate(v=>v.pause());
 await boot();assert.equal((await p.evaluate(()=>window.__vpSpectrogram550())).count,0);await boot();assert.equal((await p.evaluate(()=>window.__vpSpectrogram550())).running,false);assert.deepEqual(errors,[]);
 console.log('PASS spectrogram: real audio/known 1kHz FFT, frozen sample inspection, PNG bytes, pause/seek/collapse freeze, explicit resume, source reset, fresh/repeat boot');
}).catch(e=>{console.error(e);process.exitCode=1;});

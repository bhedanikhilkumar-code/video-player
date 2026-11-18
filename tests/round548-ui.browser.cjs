const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,c,boot,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=.5;});
 await p.locator('#quietMap548 summary').click();const initial=await p.evaluate(()=>({time:lpVideo.currentTime,rate:lpVideo.playbackRate,paused:lpVideo.paused,storage:JSON.stringify(localStorage)}));
 await p.locator('#qmScan548').click();await p.waitForFunction(()=>document.querySelectorAll('#qmList548 li').length===3);
 assert.match(await p.locator('#qmStatus548').textContent(),/3/);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),initial.paused);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.currentTime),initial.time);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),initial.rate);
 assert.match(await p.locator('#qmList548 li').first().textContent(),/0:02.00 - 0:04.00/);assert.match(await p.locator('#qmList548 li').nth(1).textContent(),/0:06.00 - 0:08.00/);
 await p.locator('#qmJump548-0-1').click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-4.15)<.03);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await p.locator('#qmMarker548-1').click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-5)<.03);
 await p.locator('#qmMin548').selectOption('2');assert.equal(await p.locator('#qmList548 li').count(),3);
 await p.locator('#qmClear548').click();assert.equal(await p.locator('#qmList548 li').count(),0);assert.equal(await p.locator('#qmClear548').isDisabled(),true);
 // A pending decode cannot republish a cancelled or stale map.
 await p.evaluate(()=>{const E=VPQuietMap548.envelope;VPQuietMap548.envelope=async(...a)=>{await new Promise(r=>setTimeout(r,250));return E(...a);};});
 await p.locator('#qmScan548').click();await p.locator('#qmCancel548').click();await p.waitForTimeout(500);assert.equal(await p.locator('#qmList548 li').count(),0);assert.match(await p.locator('#qmStatus548').textContent(),/cancelled/);
 await p.locator('#qmScan548').click();await p.locator('#lpFile').setInputFiles({name:'second548.wav',mimeType:'audio/wav',buffer:require('node:fs').readFileSync(fixture)});await p.waitForTimeout(500);assert.equal(await p.locator('#qmList548 li').count(),0);
 await p.locator('#qmScan548').click();await p.waitForFunction(()=>document.querySelectorAll('#qmList548 li').length===3);
 await boot();assert.equal(await p.locator('#qmList548 li').count(),0);await boot();assert.equal(await p.locator('#qmList548 li').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS quiet navigator: real multichannel decode, exact gap navigation, unchanged paused playback, filter, cancel, stale-file rejection, clear, fresh and repeat load');
}).catch(e=>{console.error(e);process.exitCode=1;});

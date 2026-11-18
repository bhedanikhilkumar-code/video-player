const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#quietMap548 summary').click();
 await p.evaluate(()=>{const original=OfflineAudioContext.prototype.decodeAudioData;window.__pendingQuiet548=0;OfflineAudioContext.prototype.decodeAudioData=function(bytes,done,fail){window.__pendingQuiet548++;const raw=original.call(this,bytes);raw.then(b=>{window.__releaseQuiet548=()=>{window.__pendingQuiet548--;done(b);};},fail);return raw;};});
 await p.locator('#qmScan548').click();await p.waitForFunction(()=>window.__releaseQuiet548);await p.locator('#qmCancel548').click();
 if(process.env.VP_BASELINE){console.log('BASELINE Scan disabled while cancelled native decode is pending:',await p.locator('#qmScan548').isDisabled());assert.equal(await p.locator('#qmScan548').isDisabled(),false);await p.evaluate(()=>__releaseQuiet548());return;}
 assert.equal(await p.locator('#qmScan548').isDisabled(),true,'cannot stack native decoders after cancelling');assert.match(await p.locator('#qmStatus548').textContent(),/Waiting for the audio decoder/);
 await p.evaluate(()=>__releaseQuiet548());await p.waitForFunction(()=>!document.querySelector('#qmScan548').disabled);assert.equal(await p.locator('#qmList548 li').count(),0);assert.match(await p.locator('#qmStatus548').textContent(),/cancelled/);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.deepEqual(errors,[]);
 console.log('PASS cancellation safety: single native decoder, visible wait, cancelled result discarded and retry unlocked');
}).catch(e=>{console.error(e);process.exitCode=1;});

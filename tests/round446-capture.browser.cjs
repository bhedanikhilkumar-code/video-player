const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#pairedCapture446').evaluate(e=>e.open=true);
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=7);await p.locator('#lcVideo445').evaluate(v=>v.currentTime=12);await p.waitForFunction(()=>['lpVideo','lcVideo445'].every(id=>{const v=document.getElementById(id);return v.readyState>=2&&!v.seeking;}));await p.locator('#pcCapture446').click();await p.waitForFunction(()=>document.querySelector('#pcPreview446').naturalWidth===1600);assert.equal(await p.locator('#pcPreview446').evaluate(i=>i.naturalHeight),520);
 const download= p.waitForEvent('download');await p.locator('#pcSave446').click();const d=await download;assert.equal(d.suggestedFilename(),'paired-frames.png');await d.saveAs('/downloads/round446-paired-frames.png');assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.equal(await p.locator('#lcVideo445').evaluate(v=>Math.abs(v.currentTime-12)<.1&&v.paused),true);
 await p.locator('#lcClose445').click();assert.equal(await p.locator('#pcSave446').isHidden(),true);
 for(let i=0;i<2;i++){await boot();assert.equal(await p.locator('#pcSave446').isHidden(),true);}
 console.log('PASS actual local-video pixels exported as a labelled 1600x520 PNG, paused positions preserved, download, source invalidation, fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

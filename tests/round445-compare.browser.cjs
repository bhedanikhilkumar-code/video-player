const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick();await p.locator('#localCompare445').evaluate(e=>e.open=true);assert.equal(await p.locator('#lcAlign445').isDisabled(),true);
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=9;window._src445=v.src;window._loads445=0;v.addEventListener('loadstart',()=>window._loads445++);});
 await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);
 assert.deepEqual(await p.locator('#lpVideo').evaluate(v=>({src:v.src===window._src445,t:Math.round(v.currentTime),loads:window._loads445})),{src:true,t:9,loads:0});
 assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.muted&&v.paused),true);
 await p.locator('#lcAlign445').click();assert.equal(await p.locator('#lcVideo445').evaluate(v=>Math.round(v.currentTime)),9);
 await p.locator('#lcOffset445').fill('3');await p.locator('#lcOffset445').dispatchEvent('change');assert.equal(await p.locator('#lcVideo445').evaluate(v=>Math.round(v.currentTime)),12);
 await p.locator('#lcFollow445').check();await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForFunction(()=>!document.querySelector('#lcVideo445').paused);
 await p.locator('#lpVideo').evaluate(v=>v.pause());await p.waitForFunction(()=>document.querySelector('#lcVideo445').paused);
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=15;v.playbackRate=1.5;});await p.waitForFunction(()=>Math.abs(document.querySelector('#lcVideo445').currentTime-18)<.3);
 assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.playbackRate),1.5);
 // One-shot alignment does not change an independently playing reference's transport.
 await p.locator('#lcFollow445').uncheck();await p.locator('#lcVideo445').evaluate(v=>v.play());await p.locator('#lcAlign445').click();assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),false);await p.locator('#lcFollow445').check();
 // Out-of-range offsets pause, not wrap or leak sound. A source change unlinks.
 await p.locator('#lcOffset445').fill('-100');await p.locator('#lcOffset445').dispatchEvent('change');assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),true);assert.match(await p.locator('#lcStatus445').textContent(),/outside/);
 await p.locator('#lcOffset445').fill('0');await p.locator('#lcOffset445').dispatchEvent('change');
 await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);assert.equal(await p.locator('#lcFollow445').isChecked(),false);assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),true);
 // Cancelling a replacement keeps the existing reference.
 let ref=await p.locator('#lcVideo445').getAttribute('src');await p.locator('#lcFile445').setInputFiles([]);assert.equal(await p.locator('#lcVideo445').getAttribute('src'),ref);
 await p.locator('#lcClose445').click();assert.equal(await p.locator('#lcVideo445').getAttribute('src'),null);assert.equal(await p.locator('#lcAlign445').isDisabled(),true);
 for(let n=0;n<2;n++){await boot();assert.equal(await p.locator('#lcVideo445').getAttribute('src'),null);assert.equal(await p.locator('#lcFollow445').isChecked(),false);}
 console.log('PASS: two real local MP4s, no primary restart, reference muted, one-shot align, offsets, linked play/pause/seek/rate, out-of-range pause, source replacement unlinks, cancel, close and fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

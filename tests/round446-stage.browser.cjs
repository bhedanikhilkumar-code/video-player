const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);assert.equal(await p.locator('#pairEnter446').isDisabled(),true);
 await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=7;window.mainSrc446=v.src;});await p.locator('#lcVideo445').evaluate(v=>{v.currentTime=11;window.refSrc446=v.src;});await p.locator('#pairEnter446').click();
 assert.equal(await p.locator('#pairMain446 #lpVideo').count(),1);assert.equal(await p.locator('#pairRef446 #lcVideo445').count(),1);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.src===window.mainSrc446&&Math.abs(v.currentTime-7)<.1),true);assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.src===window.refSrc446&&Math.abs(v.currentTime-11)<.1),true);
 await p.locator('#lcFollow445').check();await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForFunction(()=>!document.querySelector('#lcVideo445').paused);await p.locator('#pairExit446').click();assert.equal(await p.locator('#pairMain446 #lpVideo').count(),0);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),true);
 await p.locator('#pairEnter446').click();await p.locator('#localCompare445').evaluate(e=>e.open=false);await p.waitForFunction(()=>!document.querySelector('#pairMain446 #lpVideo'));assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 for(let i=0;i<2;i++){await boot();assert.equal(await p.locator('#pairMain446 #lpVideo').count(),0);}
 console.log('PASS paired layout keeps source/time, linked transport, exit pauses and restores, collapse restores, fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

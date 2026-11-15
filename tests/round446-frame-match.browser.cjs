const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#frameMatch446').evaluate(e=>e.open=true);
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=7);await p.locator('#fmMain446').click();assert.equal(await p.locator('#fmApply446').isDisabled(),true);
 await p.locator('#lcVideo445').evaluate(v=>v.currentTime=12.25);await p.locator('#fmRef446').click();await p.locator('#fmApply446').click();assert.equal(await p.locator('#lcOffset445').inputValue(),'5.25');assert.equal(await p.locator('#lcVideo445').evaluate(v=>Math.abs(v.currentTime-12.25)<.1),true);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await p.locator('#lcClose445').click();assert.equal(await p.locator('#fmApply446').isDisabled(),true);assert.match(await p.locator('#fmMarks446').textContent(),/Not marked/);
 for(let i=0;i<2;i++){await boot();await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#frameMatch446').evaluate(e=>e.open=true);assert.equal(await p.locator('#fmApply446').isDisabled(),true);}
 console.log('PASS matching frames, precise positive offset, paused apply, source close invalidation, fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

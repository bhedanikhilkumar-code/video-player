const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick();await p.locator('#localShuffleJourney445').evaluate(e=>e.open=true);
 assert.equal(await p.locator('#lsjBody445').isHidden(),true);
 await p.locator('#lpShuffleBtn').click();
 const snap=()=>p.evaluate(()=>window.__vpLocalShuffle445());
 let plan=await snap();assert.equal(plan.current,'Opening.mp4');assert.equal(plan.next.length,3);assert.equal(await p.locator('#lpPrev').isDisabled(),true);
 let heard=[plan.current];for(let i=0;i<3;i++){let expected=(await snap()).next[0];await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);assert.equal((await snap()).current,expected);heard.push(expected);}
 assert.equal(new Set(heard).size,4,'Every file gets one turn before a cycle repeats');
 await p.locator('#lpPrev').click();assert.equal((await snap()).current,heard[2]);await p.locator('#lpPrev').click();assert.equal((await snap()).current,heard[1]);
 await p.locator('#lpNext').click();assert.equal((await snap()).current,heard[2]);await p.locator('#lpNext').click();assert.equal((await snap()).current,heard[3]);
 await p.locator('#lpNext').click();plan=await snap();assert.equal(plan.cycle,2);assert.notEqual(plan.current,heard[3]);
 // Queue edits keep File identities, and no removed file leaks into a plan.
 await p.locator('#localQueueEditor443').evaluate(e=>e.open=true);
 let before=await snap(),all=await p.evaluate(()=>window.vpLocalPlan276()),remove=all.files.findIndex((f,i)=>i!==all.index),removed=all.files[remove].name;
 await p.locator(`[data-lqe-index="${remove}"][data-lqe-action="remove"]`).click();plan=await snap();assert.equal(plan.current,before.current);assert.equal(plan.previous.concat(plan.next).includes(removed),false);
 await p.locator('#lqeUndo443').click();plan=await snap();assert.equal(plan.current,before.current);assert.equal(plan.next.includes(removed),true);
 // Appending a new file integrates it, without resetting the active source/time.
 await p.locator('#appendDeviceFiles443').evaluate(e=>e.open=true);await p.locator('#appendInput443').setInputFiles([{...files[0],name:'New addition.mp4'}]);await p.locator('#appendGo443').click();assert.equal((await snap()).next.includes('New addition.mp4'),true);
 // Manual picks branch history. A source replacement starts a clean journey.
 await p.locator('#lpQueue [data-file-index="0"]').click();assert.equal((await snap()).current,'Opening.mp4');
 await pick(files.slice(2));plan=await snap();assert.deepEqual(plan.previous,[]);assert.equal(plan.current,'Finale.mp4');assert.deepEqual(plan.next,['Encore.mp4']);
 // Single file cannot promise another file. Closing empties the journey.
 await pick(files.slice(0,1));assert.equal(await p.locator('#lpNext').isDisabled(),true);await p.locator('#lpClose').click();assert.equal((await snap()).enabled,false);
 for(let n=0;n<2;n++){await boot();assert.equal((await snap()).enabled,false);await pick(files.slice(0,2));assert.deepEqual((await snap()).previous,[]);}
 console.log('PASS: planned no-repeat local shuffle, exact Previous/Next history, cycle boundary, manual picks, edit/remove/Undo/append, replacement, Close and fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

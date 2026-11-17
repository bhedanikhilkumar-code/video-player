const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#playbackCues509 > summary').click();
 const add=async(t,a,val)=>{await p.locator('#pcTime509').fill(t);await p.locator('#pcAction509').selectOption(a);if(a==='seek')await p.locator('#pcSeekVal509').fill(val);await p.locator('#pcAdd509').click();};
 await add('3','rate');await add('8','seek','15');await add('25','pause');await p.locator('#pcTiming513 > summary').click();await p.locator('#ctMethod513').selectOption('align');
 await p.locator('#ctOldA513').fill('2');await p.locator('#ctOldB513').fill('22');await p.locator('#ctNewA513').fill('4');await p.locator('#ctNewB513').fill('14');await p.locator('#ctTargets513').check();
 await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),true);assert.deepEqual((await p.evaluate(()=>window.__vpCues509.snapshot())).cues.map(c=>c.time),[3,8,25]);await p.locator('#ctApply513').click();let snap=await p.evaluate(()=>window.__vpCues509.snapshot());assert.deepEqual(snap.cues.map(c=>c.time),[4.5,7,15.5]);assert.equal(snap.cues[1].value,10.5);assert.equal(snap.cues[0].value,1,'speed values never scaled');
 await p.locator('#ctNewB513').fill('4');await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),false);assert.match(await p.locator('#ctStatus513').textContent(),/pairs must increase/);assert.deepEqual(await p.evaluate(()=>window.__vpCues509.snapshot()),snap);
 // Switching method disables hidden invalid anchors, so shifting still works.
 await p.locator('#ctOldA513').fill('');await p.locator('#ctMethod513').selectOption('shift');await p.locator('#ctShift513').fill('1');await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),true);await p.locator('#ctCancel513').click();
 // Review is safe while armed; applying restores the baseline and leaves disarmed.
 await p.locator('#pcArm509').click();await p.locator('#ctPreview513').click();assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).armed,true);await p.locator('#ctApply513').click();assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).armed,false);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 console.log('PASS two-point timing: proportional mapping, jump targets, no speed scaling, invalid anchors, hidden fields and armed review');
}).catch(e=>{console.error(e);process.exitCode=1;});

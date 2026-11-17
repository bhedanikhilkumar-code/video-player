const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,boot})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#playbackCues509 > summary').click();
 const add=async(t)=>{await p.locator('#pcTime509').fill(t);await p.locator('#pcAdd509').click();};const snap=()=>p.evaluate(()=>window.__vpCues509.snapshot());
 await add('3');await add('8');const before=await snap();await p.locator('#pcTiming513 > summary').click();
 const apply=async()=>{await p.locator('#ctShift513').fill('2');await p.locator('#ctPreview513').click();await p.locator('#ctApply513').click();};await apply();assert.equal(await p.locator('#ctUndo513').isVisible(),true);
 await p.locator('#ctUndo513').click();assert.deepEqual(await snap(),before);assert.equal(await p.locator('#ctUndo513').isVisible(),false);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await apply();await add('20');await p.waitForTimeout(60);assert.equal(await p.locator('#ctUndo513').isVisible(),false,'later edit permanently expires undo');
 await apply();await p.locator('#pcExchange509 > summary').click();await p.locator('#pcSave509').click();const saved=await snap();await p.locator('#ctUndo513').click();assert.notDeepEqual(await snap(),saved);await p.locator('#pcRecall509').click();assert.match(await p.locator('#pcReviewList509').textContent(),/0:07/,'undo never rewrites saved sheet');await p.locator('#pcApply509').click();assert.deepEqual(await snap(),saved);
 await boot();await pick();await p.locator('#playbackCues509 > summary').click();await p.locator('#pcExchange509 > summary').click();await p.locator('#pcRecall509').click();await p.locator('#pcApply509').click();assert.deepEqual(await snap(),saved,'saved timing survives fresh file relink');await p.locator('#pcTiming513 > summary').click();assert.equal(await p.locator('#ctUndo513').isVisible(),false,'undo is tab-only');
 await apply();await pick();assert.equal(await p.locator('#ctUndo513').isVisible(),false,'source replacement expires undo');
 console.log('PASS timing undo: atomic restore, edit/source invalidation, saved sheet isolation and fresh-load saved timing');
}).catch(e=>{console.error(e);process.exitCode=1;});

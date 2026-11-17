const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick([require('./scene504-fixture.cjs')()]);await p.locator('#sceneNav504>summary').click();await p.locator('#snScan504').click();await p.waitForFunction(()=>!document.querySelector('#snScan504').disabled);await p.locator('#snSensitivity504').selectOption('0.08');
 await p.locator('#snClipTools504>summary').click();assert.equal(await p.locator('#snClipReview504').isDisabled(),true);
 await p.locator('#snScenes504 input').nth(0).check();await p.locator('#snScenes504 input').nth(2).check();assert.match(await p.locator('#snPicked504').textContent(),/2 \/ 40/);
 // Stage only, never overwrite before the existing explicit confirmation.
 await p.locator('#snClipReview504').click();assert.equal(await p.locator('#ciReviewList500 li').count(),2);assert.equal(await p.locator('#ciList500 li').count(),0);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 assert.match(await p.locator('#ciReviewList500 li').nth(0).textContent(),/0.00–4.00 s/);assert.match(await p.locator('#ciReviewList500 li').nth(1).textContent(),/8.00–12.00 s/);
 await p.locator('#ciCancel500').click();assert.equal(await p.locator('#ciList500 li').count(),0);await p.locator('#snClipReview504').click();await p.locator('#ciConfirm500').click();assert.equal(await p.locator('#ciList500 li').count(),2);
 // Edits in progress are not discarded, and selection is cleared when the threshold changes.
 await p.locator('#ciList500 li').first().getByRole('button',{name:'Edit itinerary clip',exact:true}).click();await p.locator('#snClipReview504').click();assert.match(await p.locator('#snStatus504').textContent(),/finish or cancel/);assert.equal(await p.locator('#ciList500 li').count(),2);await p.locator('#ciEditCancel500').click();
 await p.locator('#snSensitivity504').selectOption('0.18');assert.equal(await p.locator('#snScenes504 input:checked').count(),0);
 await pick(files.slice(0,1));assert.equal(await p.locator('#snScenes504 input').count(),0);assert.equal(await p.locator('#ciReview500').isHidden(),true);
 console.log('PASS scene selection to bounded itinerary review; no overwrite or play before confirmation; cancel; exact ranges; edit protection; source invalidation');
}).catch(e=>{console.error(e);process.exitCode=1;});

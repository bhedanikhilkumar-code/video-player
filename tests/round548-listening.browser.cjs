const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#quietMap548 summary').click();await p.locator('#qmScan548').click();await p.waitForFunction(()=>document.querySelectorAll('#qmList548 li').length===3);
 await p.locator('#qmClips548').click();await p.waitForFunction(()=>!document.querySelector('#ciReview500').hidden);
 assert.equal(await p.locator('#ciConfirm500').isVisible(),true);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 const review=await p.locator('#ciReview500').textContent();assert.match(review,/3/);assert.match(review,/Retained section/);
 await p.locator('#ciCancel500').click();assert.equal(await p.locator('#ciReview500').isVisible(),false);
 await p.locator('#qmClips548').click();await p.locator('#ciConfirm500').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 assert.equal(await p.locator('#ciList500 > li').count(),3);
 await p.locator('#ciPlay500').click();await p.waitForFunction(()=>!document.querySelector('#lpVideo').paused);await p.locator('#ciStop500').click();
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.deepEqual(errors,[]);
 console.log('PASS quiet listening cut list: staged review, cancel without changes, confirm three retained ranges, explicit playback and stop');
}).catch(e=>{console.error(e);process.exitCode=1;});

// Round 511: the playback cue sheet's Jump to time cue.
// 1) A seek cue jumps a playing device file to its target second at its timestamp
//    (skip an intro without cutting the file) and the run continues past the target.
// 2) The validator accepts seek cues: a sheet saved on this device recalls with the
//    Jump to time action intact, and the open sheet snapshots it.
// 3) Everything stays disarm-clean: no page errors from arming, firing or saving.
const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();
 await p.locator('#playbackCues509 > summary').click();
 // add a seek cue: at 1s jump to 5s
 await p.locator('#pcTime509').fill('1');
 await p.locator('#pcAction509').selectOption('seek');
 assert.ok(await p.locator('#pcSeekVal509').isVisible(),'seconds input shows for the jump action');
 assert.ok(!(await p.locator('#pcValue509').isVisible()),'preset select hides for the jump action');
 await p.locator('#pcSeekVal509').fill('5');
 await p.locator('#pcAdd509').click();
 let snap=await p.evaluate(()=>window.__vpCues509.snapshot());
 assert.equal(snap.cues.length,1,'one cue added');
 assert.equal(snap.cues[0].action,'seek');
 assert.equal(snap.cues[0].value,5);
 // arm and play: the run must jump from ~1s to 5s and keep playing past it
 await p.locator('#pcArm509').click();
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=0;v.play();});
 await p.waitForFunction(()=>{const v=document.querySelector('#lpVideo');return v.currentTime>4.2&&!v.paused;},{timeout:8000});
 const st=await p.locator('#pcStatus509').textContent();
 assert.ok(/Cue applied|क्यू लागू/.test(st),'applied cue is announced: '+st);
 // save the sheet on this device, then recall it: the seek cue round-trips
 await p.locator('#pcSave509').click();
 await p.locator('#pcRecall509').click();
 const review=await p.locator('#pcReviewList509').textContent();
 assert.ok(/Jump to time|समय पर जाएं/.test(review),'saved sheet recalls the jump action: '+review);
 await p.locator('#pcReject509').click();
 snap=await p.evaluate(()=>window.__vpCues509.snapshot());
 assert.equal(snap.cues.length,1,'sheet unchanged after a rejected recall');
 console.log('PASS round511: jump cue seeks at its timestamp, plays on, and round-trips through device save/review');
}).catch(e=>{console.error(e);process.exitCode=1;});

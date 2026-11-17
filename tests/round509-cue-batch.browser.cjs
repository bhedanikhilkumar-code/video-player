const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=0;v.playbackRate=1;v.volume=.8;});await p.locator('#playbackCues509 > summary').click();
 const add=async(a,val)=>{await p.locator('#pcTime509').fill('.3');await p.locator('#pcAction509').selectOption(a);if(val!==undefined)await p.locator('#pcValue509').selectOption(String(val));await p.locator('#pcAdd509').click();};
 await add('pause');await add('rate',.5);await add('volume',.25);await p.locator('#pcArm509').click();await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForFunction(()=>document.querySelector('#lpVideo').paused&&document.querySelector('#lpVideo').currentTime>=.28);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),.5,'same-time speed change must not wait for a second Play');assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.25,'same-time volume change must apply before pausing');
 await p.locator('#pcStop509').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),1);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.8);
 console.log('PASS simultaneous cues apply speed and volume before pause regardless of insertion order');
}).catch(e=>{console.error(e);process.exitCode=1;});

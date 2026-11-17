const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,boot})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=0;v.playbackRate=1;v.volume=.8;});
 await p.locator('#playbackCues509 summary').click();
 const add=async(name,time,action,value)=>{await p.locator('#pcName509').fill(name);await p.locator('#pcTime509').fill(String(time));await p.locator('#pcAction509').selectOption(action);if(value!==undefined)await p.locator('#pcValue509').selectOption(String(value));await p.locator('#pcAdd509').click();};
 await add('Slow practice',.2,'rate',.5);await add('Quiet section',.4,'volume',.25);await add('Review here',.7,'pause');
 assert.equal(await p.locator('#pcList509 li').count(),3);
 await p.locator('#pcArm509').click();await p.locator('#lpVideo').evaluate(v=>v.play());
 await p.waitForFunction(()=>document.querySelector('#lpVideo').paused&&document.querySelector('#lpVideo').currentTime>.65);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),.5);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.25);
 await p.locator('#pcStop509').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),1);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.8);
 // Seek ahead skips pause/speed/volume rather than applying all crossed actions.
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=0);await p.waitForFunction(()=>!document.querySelector('#lpVideo').seeking);await p.locator('#pcArm509').click();
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=2);await p.waitForFunction(()=>!document.querySelector('#lpVideo').seeking);await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForTimeout(250);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),1);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.8);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false);
 // Going back rearms future cues.
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=0);await p.waitForFunction(()=>document.querySelector('#lpVideo').paused&&document.querySelector('#lpVideo').currentTime>.65);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),.5);
 // Manual override wins but the other unchanged property is restored.
 await p.locator('#lpVideo').evaluate(v=>v.playbackRate=1.5);await p.waitForFunction(()=>!window.__vpCues509.snapshot().armed);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.playbackRate),1.5);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.volume),.8);
 // Edit is transactional and remove moves keyboard focus to a usable control.
 await p.locator('#pcList509 li').nth(0).getByRole('button',{name:'Edit playback cue',exact:true}).click();await p.locator('#pcName509').fill('Cancelled name');await p.locator('#pcCancel509').click();assert.ok((await p.locator('#pcList509 li').nth(0).textContent()).includes('Slow practice'));
 await p.locator('#pcList509 li').nth(0).getByRole('button',{name:'Edit playback cue',exact:true}).click();await p.locator('#pcTime509').fill('1.2');await p.locator('#pcAdd509').click();assert.ok((await p.locator('#pcList509 li').nth(2).textContent()).includes('Slow practice'));
 await p.locator('#pcList509 li').nth(2).getByRole('button',{name:'Remove playback cue',exact:true}).click();assert.equal(await p.locator('#pcList509 li').count(),2);assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Remove playback cue');
 // No automatic arming or leftover sheet after choosing another file.
 await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);assert.deepEqual(await p.evaluate(()=>window.__vpCues509.snapshot()),{cues:[],armed:false,editing:false});
 console.log('PASS cue sheet: rate, volume, pause, restore, seek skip/rearm, manual ownership, editing, focus, source reset');
}).catch(e=>{console.error(e);process.exitCode=1;});

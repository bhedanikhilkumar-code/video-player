const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=0;});await p.locator('#playbackCues509 > summary').click();await p.locator('#pcTime509').fill('10');await p.locator('#pcAdd509').click();await p.locator('#pcArm509').click();await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForTimeout(200);
 await p.evaluate(()=>{window.pcMutations509=0;window.pcObserver509=new MutationObserver(ms=>window.pcMutations509+=ms.length);window.pcObserver509.observe(document.querySelector('#pcStatus509'),{childList:true,subtree:true,characterData:true});window.pcObserver509.observe(document.querySelector('#pcNext509'),{childList:true,subtree:true,characterData:true});});
 await p.waitForTimeout(600);const mutations=await p.evaluate(()=>{pcObserver509.disconnect();return pcMutations509;});assert.equal(mutations,0,'unchanged cue status must not be recreated every animation frame');
 await p.locator('#pcStop509').click();assert.ok((await p.locator('#pcStatus509').textContent()).includes('Previous speed and volume restored'));
 console.log('PASS cue announcements stay quiet between real status changes during playback');
}).catch(e=>{console.error(e);process.exitCode=1;});

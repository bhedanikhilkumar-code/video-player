const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.locator('#linkInput').fill('https://youtube.com/watch?v=dQw4w9WgXcQ');await p.locator('#loadBtn').click();await p.locator('#ctl-sleep').evaluate(e=>e.open=true);await pick(files.slice(0,1));
 await p.locator('#sleepPlayOnly').check();await p.locator('#sleepMinutes').fill('1');await p.locator('#sleepStart').click();
 await p.waitForTimeout(1100);let end=await p.evaluate(()=>Number(localStorage.getItem('vp-sleep-end.v1')));
 await p.evaluate(()=>{window._now445=Date.now;window._delta445=10000;Date.now=()=>window._now445()+window._delta445;});
 await p.waitForFunction(old=>Number(localStorage.getItem('vp-sleep-end.v1'))>old+9000,end);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await p.locator('#lpVideo').evaluate(v=>v.play());await p.evaluate(()=>window._delta445+=30000);await p.waitForFunction(()=>document.querySelector('#sleepLabel').textContent.includes('0:2'));
 await p.evaluate(()=>window._delta445+=35000);await p.waitForFunction(()=>document.querySelector('#lpVideo').paused);
 console.log('PASS: playing-only sleep timer holds while the local file is paused, advances while it plays, then expires without ReferenceError.');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.locator('#linkInput').fill('https://youtube.com/watch?v=dQw4w9WgXcQ');await p.locator('#loadBtn').click();await p.locator('#ctl-sleep').evaluate(e=>{e.open=true;});
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);
 await p.locator('#lcVideo445').evaluate(v=>{v.volume=.8;return v.play();});
 await p.locator('#sleepMinutes').fill('1');await p.locator('#sleepStart').click();
 await p.locator('#sleepFade').check();await p.locator('#sleepPlayOnly').check();
 await p.waitForTimeout(1100);await p.evaluate(()=>{window._now445=Date.now;window._delta445=30000;Date.now=()=>window._now445()+window._delta445;});await p.waitForTimeout(1100);
 await p.waitForFunction(()=>document.querySelector('#lcVideo445').volume<.5);assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),false);
 await p.evaluate(()=>window._delta445=61000);
 await p.waitForFunction(()=>document.querySelector('#lcVideo445').paused);
 assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.paused),true,'Sleep timer must also stop an independent reference video');
 assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.volume),.8,'Reference volume restores after sleep expiry');
 console.log('PASS: sleep expiry stops the independent reference video.');
}).catch(e=>{console.error(e);process.exitCode=1;});

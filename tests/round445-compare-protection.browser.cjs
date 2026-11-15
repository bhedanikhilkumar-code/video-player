const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.locator('#linkInput').fill('https://youtube.com/watch?v=dQw4w9WgXcQ');await p.locator('#loadBtn').click();await p.locator('#frameBox iframe').waitFor({state:'attached'});
 await p.evaluate(()=>{const f=document.querySelector('#frameBox iframe');for(const [event,info] of [['onReady',null],['infoDelivery',{currentTime:8,duration:213}],['onStateChange',1]])window.dispatchEvent(new MessageEvent('message',{source:f.contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}}));});
 await pick(files.slice(0,1));await p.locator('#lpVideo').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#playerDock').classList.contains('is-mini'));
 await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#lcVideo445').evaluate(v=>v.play());await p.waitForFunction(()=>!document.querySelector('#playerDock').classList.contains('is-mini'));
 await p.locator('#privBtn269').evaluate(e=>{for(let d=e.closest('details');d;d=d.parentElement.closest('details'))d.open=true;});await p.locator('#privBtn269').click();await p.waitForFunction(()=>document.querySelector('#lcVideo445').paused);assert.equal(await p.locator('#lcFollow445').isChecked(),false);await p.keyboard.press('Escape');
 console.log('PASS: reference play dismisses the YouTube mini player and selects local playback; opening a privacy cover pauses the reference and unlinks following.');
}).catch(e=>{console.error(e);process.exitCode=1;});

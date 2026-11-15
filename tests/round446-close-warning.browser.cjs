const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#warnCloseChk312').evaluate(e=>{const s=e.closest('section');if(s&&window.vpExpandSection)window.vpExpandSection(s.id);});await p.locator('#warnCloseChk312').check();await p.locator('#lcVideo445').evaluate(v=>v.play());
 const prevented=()=>p.evaluate(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented;});assert.equal(await prevented(),true,'Close warning must include independent reference playback');await p.locator('#lcVideo445').evaluate(v=>v.pause());assert.equal(await prevented(),false,'Paused reference should not block closing');
 await p.locator('#lcVideo445').evaluate(v=>v.play());let prompt=false;p.once('dialog',async d=>{assert.equal(d.type(),'beforeunload');prompt=true;await d.accept();});await p.reload();assert.equal(prompt,true,'A real reload should show the browser close warning');
 console.log('PASS close warning counts active reference, ignores paused reference, and appears on a real browser reload.');
}).catch(e=>{console.error(e);process.exitCode=1;});

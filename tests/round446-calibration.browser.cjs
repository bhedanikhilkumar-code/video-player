const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#timingCalibration446').evaluate(e=>e.open=true);
 async function point(a,b,id){await p.locator('#lpVideo').evaluate((v,t)=>v.currentTime=t,a);await p.locator('#lcVideo445').evaluate((v,t)=>v.currentTime=t,b);await p.waitForFunction(()=>["lpVideo","lcVideo445"].every(id=>{const v=document.getElementById(id);return v.readyState>=2&&!v.seeking;}));await p.locator(id).click();}
 await point(5,7,'#tcOne446');assert.equal(await p.locator('#tcApply446').isDisabled(),true);await point(15,19,'#tcTwo446');await p.locator('#tcApply446').click();assert.match(await p.locator('#tcStatus446').textContent(),/active.*1.20000x/);
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=10);await p.locator('#lcAlign445').click();assert.equal(await p.locator('#lcVideo445').evaluate(v=>Math.abs(v.currentTime-13)<.15&&Math.abs(v.playbackRate-1.2)<.001),true);
 await p.locator('#lcFollow445').check();await p.locator('#lpVideo').evaluate(v=>{v.playbackRate=1.5;return v.play();});await p.waitForFunction(()=>Math.abs(document.querySelector('#lcVideo445').playbackRate-1.8)<.01);await p.locator('#lpVideo').evaluate(v=>v.pause());
 await p.locator('#tcClear446').click();await p.locator('#lcAlign445').click();assert.equal(await p.locator('#lcVideo445').evaluate(v=>v.playbackRate),1.5);
 await point(20,2,'#tcOne446');await point(10,10,'#tcTwo446');assert.equal(await p.locator('#tcApply446').isDisabled(),true);
 await point(2,2,'#tcOne446');await point(10,10,'#tcTwo446');await p.locator('#tcApply446').click();await p.locator('#lcClose445').click();assert.match(await p.locator('#tcStatus446').textContent(),/off/);
 for(let i=0;i<2;i++){await boot();assert.match(await p.locator('#tcStatus446').textContent(),/off/);}
 console.log('PASS two-point mapping, interpolated seek, scaled rate, follow transport, reset, invalid anchors, source clear, fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

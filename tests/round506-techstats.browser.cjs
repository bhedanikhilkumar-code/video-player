const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot,pick})=>{
 await boot();
 // chip exists on the transport row, panel hidden
 assert.ok(await p.evaluate(()=>!!document.querySelector('#fxRow #techStatsBtn506')));
 assert.ok(await p.evaluate(()=>!!document.querySelector('#techStatsLpBtn506')));
 assert.equal(await p.evaluate(()=>document.querySelector('#techStats506').style.display),'none');
 // toggle on via the exposed setter (the YouTube chip sits in controls hidden until playback): panel shows, empty state names Nothing playing
 await p.evaluate(()=>window.__vpTechStats506.setOn(true));
 assert.notEqual(await p.evaluate(()=>document.querySelector('#techStats506').style.display),'none');
 await p.waitForFunction(()=>[...document.querySelectorAll('#techStatsRows506 dd')].some(d=>d.textContent==='Nothing playing'));
 // play a local file: rows switch to device-file data
 await pick();
 await p.waitForFunction(()=>[...document.querySelectorAll('#techStatsRows506 dd')].some(d=>d.textContent==='Device file'));
 await p.waitForFunction(()=>{const v=document.querySelector('#lpVideo');return v&&v.videoWidth>0;});
 await p.waitForTimeout(700);
 const txt=await p.evaluate(()=>[...document.querySelectorAll('#techStatsRows506')].map(d=>d.textContent).join(' '));
 assert.ok(/640 × 360/.test(txt),txt);
 assert.ok(/dropped/.test(txt),txt);
 assert.ok(/1x/.test(txt),txt);
 await p.screenshot({path:'/downloads/r506-techstats-en.png'});
 // Hindi repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#techStatsH506').textContent==='टेक आंकड़े');
 assert.ok(await p.evaluate(()=>[...document.querySelectorAll('#techStatsRows506 dd')].some(d=>d.textContent==='डिवाइस फ़ाइल')));
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(400);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await p.screenshot({path:'/downloads/r506-techstats-hi.png'});
 // Gujarati repaint
 await p.locator('#langBtn').click();
 await p.waitForFunction(()=>document.querySelector('#techStatsH506').textContent==='ટેક આંકડા');
 assert.ok(await p.evaluate(()=>[...document.querySelectorAll('#techStatsRows506 dd')].some(d=>d.textContent==='ડિવાઇસ ફાઇલ')));
 // toggle off hides the panel and stops it staying visible after repaint
 await p.locator('#techStatsLpBtn506').click();
 assert.equal(await p.evaluate(()=>document.querySelector('#techStats506').style.display),'none');
 console.log('PASS tech stats: toggle, empty state, device-file rows, resolution/frames/speed, hi/gu repaint, 390px');
}).catch(e=>{console.error(e);process.exitCode=1;});

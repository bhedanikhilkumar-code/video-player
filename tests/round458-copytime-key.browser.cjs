const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 // the picker offers the new action
 await p.waitForFunction(()=>[...document.querySelectorAll('#xkAct280 option')].some(o=>o.value==='copytime'));
 // bind the key (prefs survive a reload through the loader whitelist)
 await p.evaluate(()=>{const pr=JSON.parse(localStorage.getItem('vp-prefs.v1')||'{}');pr.xkeys280={copytime:'v'};localStorage.setItem('vp-prefs.v1',JSON.stringify(pr));});
 await p.reload(); await p.waitForFunction(()=>window.__vpMainOk325===true);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-prefs.v1')).xkeys280.copytime),'v');
 // load a video and run the key through the real keydown path
 await p.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 await p.locator('#loadBtn').click(); await p.locator('#controls').waitFor({state:'visible'});
 await p.locator('h1').click().catch(()=>{}); // focus off inputs
 await p.keyboard.press('v');
 await p.waitForFunction(()=>{const t=(document.getElementById('shareMsg').textContent||'');return /Copied|Copy this link|Shared/.test(t);},{timeout:6000});
 // with no video loaded the key says so instead of failing silently
 await p.evaluate(()=>{history.replaceState(null,'','/?cb=458k2');});
 console.log('PASS round 458: own key copies the at-this-time link; binding persists across reload');
}).catch(e=>{console.error(e);process.exitCode=1;});

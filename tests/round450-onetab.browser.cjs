const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c,files,origin,pick})=>{
 await pick([files[0]]);
 // The card exists, default on.
 assert.equal(await p.locator('#oneTabBtn450').getAttribute('aria-pressed'),'true');
 await p.evaluate(()=>{const v=document.getElementById('lpVideo');v.muted=true;return v.play();});
 await p.waitForFunction(()=>!document.getElementById('lpVideo').paused);
 await p.waitForTimeout(900);
 // Second tab starts playing later: the first tab pauses.
 const q=await c.newPage();await q.goto(origin+'/?cb=450-b');await q.waitForFunction(()=>window.__vpMainOk325&&window.__vpOneTab450);
 await q.locator('#lpFile').setInputFiles([files[1]]);await q.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);
 await q.evaluate(()=>{const v=document.getElementById('lpVideo');v.muted=true;return v.play();});
 await p.waitForFunction(()=>document.getElementById('lpVideo').paused,null,{timeout:4000});
 assert.equal(await q.evaluate(()=>document.getElementById('lpVideo').paused),false,'newer tab keeps playing');
 assert.match(await p.locator('#vpToast').textContent(),/another tab/);
 // Switch off: a later start in tab 2 does not pause tab 1.
 await p.evaluate(()=>document.getElementById('oneTabBtn450').click());
 assert.equal(await p.locator('#oneTabBtn450').getAttribute('aria-pressed'),'false');
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-prefs.v1')).oneTab449),false);
 await p.evaluate(()=>document.getElementById('lpVideo').play());await p.waitForTimeout(900);
 await q.evaluate(()=>{const v=document.getElementById('lpVideo');v.pause();return v.play();});await p.waitForTimeout(1200);
 assert.equal(await p.evaluate(()=>document.getElementById('lpVideo').paused),false,'off means no pause');
 await q.close();
});

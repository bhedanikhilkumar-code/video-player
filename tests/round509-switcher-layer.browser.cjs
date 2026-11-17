const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot,pick})=>{
 await p.evaluate(()=>localStorage.setItem('vp-library.v1',JSON.stringify({favs:[],queue:[],later:[],hist:[{id:'dQw4w9WgXcQ',title:'Rick Astley - Never Gonna Give You Up',t:12,dur:213},{id:'9bZkp7q19f0',title:'PSY - Gangnam Style',t:20,dur:253}]})));await boot();
 await p.locator('#linkInput').fill('https://youtu.be/dQw4w9WgXcQ');await p.locator('#loadBtn').click();await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());
 await p.setViewportSize({width:390,height:844});await p.locator('#lpVideo').scrollIntoViewIfNeeded();await p.waitForTimeout(600);await p.locator('#help').evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));
 await p.evaluate(()=>window.__vpSwitch506.open());await p.screenshot({path:'/downloads/r509-switcher-docked.png'});
 assert.ok(await p.evaluate(()=>{const r=document.querySelector('#lpViewWrap').getBoundingClientRect();return !!document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('#rswBg506');}),'the docked player must not sit above the modal or take its pointer events');
 assert.ok(await p.locator('#rswBg506').evaluate(e=>e.matches(':popover-open')));
 await p.keyboard.press('Tab');assert.ok(await p.evaluate(()=>!!document.activeElement.closest('#rswCard506')));await p.keyboard.press('Escape');assert.equal(await p.locator('#rswBg506').count(),0);assert.ok(await p.locator('#lpVideo').evaluate(v=>v.readyState>=2));
 console.log('PASS recent switcher stays above the docked player on a 390px screen and closes cleanly');
}).catch(e=>{console.error(e);process.exitCode=1;});

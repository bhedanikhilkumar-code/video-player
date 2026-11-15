const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#lpViewWrap').scrollIntoViewIfNeeded();await p.waitForTimeout(300);
 await p.locator('#lpViewWrap').evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().bottom+800));await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));
 await p.locator('#lpMiniBack447').click();await p.waitForFunction(()=>{let e=document.querySelector('#lpViewWrap'),r=e.getBoundingClientRect();return !e.classList.contains('lpMini447')&&r.top>=70&&r.bottom<=innerHeight;});
 await p.waitForTimeout(500);assert.equal(await p.locator('.lpMiniPh447').count(),0);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false);
 console.log('PASS Back reaches the actual device video, not the centre of the long file section, without re-docking or pausing.');
}).catch(e=>{console.error(e);process.exitCode=1;});

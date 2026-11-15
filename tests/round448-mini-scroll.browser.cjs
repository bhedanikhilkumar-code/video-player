const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#lpViewWrap').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
 const top=await p.locator('#lpViewWrap').evaluate(e=>scrollY+e.getBoundingClientRect().bottom+200);
 await p.evaluate(t=>scrollTo(0,t),top);await p.waitForTimeout(200);assert.equal(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')),true,'First scroll docks');
 for(let i=1;i<=4;i++){await p.evaluate(t=>scrollTo(0,t),top+100*i);await p.waitForTimeout(100);assert.equal(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')),true,'Continued scrolling must not remove the dock');}

 console.log('PASS mini stays docked across repeated scrolls.');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#lpViewWrap').scrollIntoViewIfNeeded();await p.waitForTimeout(400);
 await p.evaluate(()=>{window.vpAsk('Name this saved item','',{select:true});});
 await p.locator('#lpViewWrap').evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().bottom+600));await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);
 assert.equal(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')),false,'A pending Save/Cancel must prevent a newer video popover above it');
 await p.locator('#vpAskBg .vp-ask-row button').first().click();await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false);console.log('PASS dialog owns the top layer during scroll/phone resize and the device dock returns after Cancel.');
}).catch(e=>{console.error(e);process.exitCode=1;});

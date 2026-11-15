const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();const second=p.locator('#lpQueue [data-file-index="1"]');await second.focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);
 assert.equal(await p.evaluate(()=>document.activeElement===document.querySelector('#lpQueue [data-file-index="1"]')),true,'Choosing a queued file must keep keyboard focus on that file');
 await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement===document.querySelector('#lpQueue [data-file-index="2"]')),true);
 console.log('PASS: selecting a local queue file preserves keyboard focus; Tab continues to the next file.');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,2));
 await p.locator('#lpVideo').evaluate(v=>{const play=v.play.bind(v);let first=true;v.play=function(){if(first){first=false;return new Promise((_,reject)=>window._reject445=reject);}return play();};});
 await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);
 await p.locator('#lpQueue [data-file-index="0"]').click();await p.waitForFunction(()=>!document.querySelector('#lpVideo').paused);
 const current=await p.locator('#lpSessionMsg').textContent();await p.evaluate(()=>window._reject445(new DOMException('old request blocked','NotAllowedError')));await p.waitForTimeout(150);
 assert.equal(await p.locator('#lpSessionMsg').textContent(),current,'An old play rejection cannot replace the active file status');
 // Same-source rejection after Close must not overwrite the close confirmation.
 await p.locator('#lpVideo').evaluate(v=>{v.play=()=>new Promise((_,reject)=>window._reject445=reject);});await p.locator('#lpNext').click();await p.locator('#lpClose').click();const closed=await p.locator('#lpSessionMsg').textContent();await p.evaluate(()=>window._reject445(new DOMException('old request blocked','NotAllowedError')));await p.waitForTimeout(150);assert.equal(await p.locator('#lpSessionMsg').textContent(),closed);
 console.log('PASS: delayed play rejection cannot overwrite a newer playing source or Close status.');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
require('./round538-harness.cjs')(async({p,errors})=>{
 const fixture=require('./round548-fixture.cjs')(),hash=crypto.createHash('sha256').update(fs.readFileSync(fixture)).digest('hex');
 await p.locator('#lpFile').setInputFiles(fixture);await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));
 await p.evaluate(()=>{window.__dropFixture551=window.__vpLocalQueue443.currentFile548();});await p.locator('#lpClose').click();
 await p.evaluate(()=>{const dt=new DataTransfer();dt.items.add(window.__dropFixture551);window.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));});
 await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));
 const state=await p.evaluate(()=>({queue:__vpLocalQueue443.snapshot(),file:!!__vpLocalQueue443.currentFile548(),source:document.querySelector('#lpVideo').getAttribute('src')}));
 assert.equal(state.file,true,'single dropped file must remain an actual File, not only a blob URL');assert.equal(state.queue.files.length,1);assert.match(state.source,/^blob:/);
 await p.locator('#fileIntegrity551 summary').click();await p.locator('#fiBuild551').click();await p.waitForFunction(()=>document.querySelector('#fiDigest551').value.length===64);assert.equal(await p.locator('#fiDigest551').inputValue(),hash);
 assert.equal(await p.locator('#exBuild549').isDisabled(),false,'dropped file supports excerpt analysis');
 await p.locator('#lpClose').click();await p.evaluate(()=>{const dt=new DataTransfer();dt.items.add(__dropFixture551);dt.items.add(new File([__dropFixture551],'Second.wav',{type:'audio/wav'}));window.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));});await p.waitForFunction(()=>__vpLocalQueue443.snapshot().files.length===2);assert.equal((await p.evaluate(()=>__vpLocalQueue443.snapshot())).index,0);await p.locator('#lpClose').click();assert.equal((await p.evaluate(()=>__vpLocalQueue443.snapshot())).files.length,0);
 assert.deepEqual(errors,[]);console.log('PASS drop: one real File retained in queue, exact original SHA256, file analyses enabled, multi-file order and close cleanup');
}).catch(e=>{console.error(e);process.exitCode=1;});

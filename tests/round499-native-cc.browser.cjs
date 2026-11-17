const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#dualSub499>summary').click();
 const file=(name)=>({name,mimeType:'text/plain',buffer:Buffer.from('1\n00:00:01,000 --> 00:00:10,000\nCaption\n')});
 await p.locator('#dualFile499').setInputFiles(file('second.srt'));await p.waitForFunction(()=>!document.querySelector('#dualToggle499').disabled);
 // Native CC menus change TextTrack.mode. The card must follow that choice.
 await p.evaluate(()=>Array.from(document.querySelector('#lpVideo').textTracks).find(t=>t.label==='Companion captions').mode='disabled');await p.waitForTimeout(100);
 assert.equal(await p.locator('#dualToggle499').textContent(),'Show companion captions');assert.equal(await p.evaluate(()=>Array.from(document.querySelector('#lpVideo').textTracks).find(t=>t.label==='Companion captions').mode),'disabled');
 await p.locator('#dualToggle499').click();
 await p.locator('#lpSubFile').setInputFiles(file('first.srt'));await p.waitForFunction(()=>Array.from(document.querySelector('#lpVideo').textTracks).filter(t=>t.mode==='showing').length===2);
 assert.match(await p.locator('#dualStatus499').textContent(),/1 line\./);
 console.log('PASS native CC disable is respected, card follows choice, primary replacement still preserves companion, singular count');
}).catch(e=>{console.error(e);process.exitCode=1});

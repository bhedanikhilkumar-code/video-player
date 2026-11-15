const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 const id='dQw4w9WgXcQ';await p.locator('#linkInput').fill(id);await p.locator('#loadBtn').click();
 await p.locator('#passImpFile449').setInputFiles({name:'notes-and-moments.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({kind:'vp-video-passport',v:1,id,marks:[{t:12,name:'Imported moment'}],note:'Imported note'}))});
 await p.locator('#passportApply453').click();
 assert.equal(await p.locator('#noteBox').inputValue(),'Imported note');
 await p.locator('#markList button[aria-label="Delete moment 0:12"]').evaluate(b=>b.click());
 await p.locator('#noteClearBtn').evaluate(b=>b.click());
 const stores=()=>p.evaluate(id=>({marks:JSON.parse(localStorage.getItem('vp-marks.v1')||'{}')[id]||[],note:JSON.parse(localStorage.getItem('vp-notes.v1')||'{}')[id]||''}),id);
 assert.deepEqual(await stores(),{marks:[],note:''},'removing newly imported items must be persisted, not resurrected by a stale merge baseline');
 await boot();await boot();assert.deepEqual(await stores(),{marks:[],note:''});
 console.log('PASS imported moments and notes can be deleted before a reload and stay deleted across fresh/repeat loads');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot,pick,files})=>{
 const id='dQw4w9WgXcQ';await p.locator('#linkInput').fill(id);await p.locator('#loadBtn').click();
 const imp=async extra=>{await p.locator('#passImpFile449').setInputFiles({name:'passport.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({kind:'vp-video-passport',v:1,id,title:'Opening - saved video notes',...extra}))});await p.locator('#passportApply453').click();};
 const read=()=>p.evaluate(id=>({marks:JSON.parse(localStorage.getItem('vp-marks.v1')||'{}')[id]||[],note:JSON.parse(localStorage.getItem('vp-notes.v1')||'{}')[id]||'',memory:JSON.parse(localStorage.getItem('vp-vmem.v1')||'{}')[id]||null,lyrics:JSON.parse(localStorage.getItem('vp-lyrics.v1')||'{}')[id]||''}),id);
 await imp({marks:[{t:12,name:'Original opening'},{t:25,name:'Original example'}],note:'Original note',memory:{speed:1.5,vol:80},lyrics:'Original lyrics'});
 assert.equal(await p.locator('[data-undo-passport="1"]').count(),1);
 // Keep a renamed imported moment and an edited note, without preserving unrelated imported data.
 await p.locator('#markList button[aria-label="Rename moment 0:12"]').evaluate(b=>b.click());
 await p.locator('#vpAskBg input').fill('My newer name');await p.locator('#vpAskBg .vp-ask-row button').last().click();
 await p.locator('#noteBox').fill('My newer note');await p.locator('#noteBox').blur();await p.waitForTimeout(600);
 await imp({marks:[{t:90,name:'From the second passport'}]});
 await p.locator('[data-undo-passport="1"]').evaluate(b=>b.click());
 assert.deepEqual(await read(),{marks:[{t:12,name:'My newer name'},{t:90,name:'From the second passport'}],note:'My newer note',memory:null,lyrics:''});
 assert.match(await p.locator('[data-receipt="1"]').innerText(),/Reverted 3 imported items; kept 2 newer edits/);
 assert.equal(await p.locator('[data-undo-passport="1"]').isDisabled(),true);
 await p.locator('[data-undo-passport="2"]').evaluate(b=>b.click());
 assert.deepEqual((await read()).marks,[{t:12,name:'My newer name'}]);
 // Full rollback on another video removes all four kinds, leaving the first video's edits intact.
 await imp({id:'abcdefghijk',title:'Second video',marks:[{t:10,name:'Opening'}],note:'Second note',memory:{speed:1.25},lyrics:'Second lyrics'});
 await p.locator('[data-undo-passport="3"]').evaluate(b=>b.click());
 assert.deepEqual(await p.evaluate(()=>['vp-marks.v1','vp-notes.v1','vp-vmem.v1','vp-lyrics.v1'].map(k=>JSON.parse(localStorage.getItem(k)||'{}').abcdefghijk||null)),[null,null,null,null]);
 assert.equal((await read()).note,'My newer note');
 // Show the receipts and their honest undo outcomes.
 await pick([files[0]]);await p.locator('#lpVideo').evaluate(v=>{v.muted=true;return v.play();});await p.locator('#lpViewWrap').scrollIntoViewIfNeeded();await p.waitForTimeout(600);
 await p.locator('#passportReceipts453').scrollIntoViewIfNeeded();await p.setViewportSize({width:1200,height:900});await p.waitForTimeout(500);
 await p.screenshot({path:'/tmp/r453/passport-receipts-en.png'});
 for(const lang of ['hi','gu']){await p.setViewportSize({width:390,height:844});await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.getElementById('langBtn').getAttribute('aria-busy')!=='true');assert.doesNotMatch(await p.locator('#passportReceipts453 summary').textContent(),/Reversible passport imports/);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);}
 // A bounded ledger never grows beyond five receipts.
 for(let n=0;n<6;n++)await imp({marks:[{t:100+n,name:'Another import '+n}]});
 assert.equal(await p.locator('#passportReceipts453 [data-receipt]').count(),5);
 const saved=await read();await boot();await boot();assert.deepEqual(await read(),saved);assert.equal(await p.locator('#passportReceipts453 [data-receipt]').count(),0,'receipts, not saved data, end on reload');
 console.log('PASS selective passport undo keeps renamed moments/newer notes/later imports, removes only original additions, bounds receipts at five, preserves saves and expires receipts on reload, HI/GU phone layout');
}).catch(e=>{console.error(e);process.exitCode=1;});

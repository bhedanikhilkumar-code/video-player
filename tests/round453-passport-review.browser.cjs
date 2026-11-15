const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot,pick,files})=>{
 const id='abcdefghijk',payload={kind:'vp-video-passport',v:1,id,title:'Device lesson',marks:[{t:12,name:'Opening idea'},{t:25,name:'Practical example'}],note:'Keep the useful idea, not the whole recording.',memory:{speed:1.5,vol:80,cc:true,intro:5},lyrics:'An optional transcript\nSecond line'};
 const file={name:'lesson-passport.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))};
 const imp=async()=>{await p.locator('#passImpFile449').setInputFiles(file);await p.locator('#passportReview453').waitFor({state:'visible'});};
 const read=()=>p.evaluate(id=>['vp-marks.v1','vp-notes.v1','vp-vmem.v1','vp-lyrics.v1'].map(k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')[id]||null;}catch{return null;}}),id);
 // Cancel and Escape are side-effect free. The preview cannot execute content as markup.
 await imp();assert.deepEqual(await read(),[null,null,null,null]);assert.match(await p.locator('#passportReview453').innerText(),/Opening idea/);
 await p.locator('#passportCancel453').click();assert.deepEqual(await read(),[null,null,null,null]);
 await imp();await p.keyboard.press('Escape');assert.equal(await p.locator('#passportReview453').count(),0);assert.deepEqual(await read(),[null,null,null,null]);
 // Select only moments and notes; lyrics and settings must remain absent.
 await imp();await p.locator('#passportPick453-memory').uncheck();await p.locator('#passportPick453-lyrics').uncheck();await p.locator('#passportApply453').click();
 let values=await read();assert.equal(values[0].length,2);assert.equal(values[1],payload.note);assert.equal(values[2],null);assert.equal(values[3],null);
 // Conflict sections are disabled; fresh sections remain individually selectable.
 await imp();assert.equal(await p.locator('#passportPick453-marks').isDisabled(),true);assert.equal(await p.locator('#passportPick453-note').isDisabled(),true);
 await p.locator('#passportPick453-memory').uncheck();await p.locator('#passportPick453-lyrics').uncheck();assert.equal(await p.locator('#passportApply453').isDisabled(),true);
 await p.locator('#passportPick453-memory').check();await p.locator('#passportPick453-lyrics').check();await p.locator('#passportApply453').click();
 values=await read();assert.equal(values[2].speed,1.5);assert.equal(values[3],payload.lyrics);
 await boot();await boot();assert.equal((await read())[0].length,2);
 await imp();assert.equal(await p.locator('#passportApply453').isDisabled(),true);await p.locator('#passportCancel453').click();
 // Device video stays visible behind the modal, even when it was docked.
 await pick([files[0]]);await p.locator('#lpVideo').evaluate(v=>{v.muted=true;return v.play();});
 await p.locator('#lpViewWrap').scrollIntoViewIfNeeded();await p.waitForTimeout(600);await p.locator('#lpViewWrap').evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().bottom+600));
 await p.waitForFunction(()=>document.getElementById('lpViewWrap').classList.contains('lpMini447'));
 const fresh={...payload,id:'zyxwvutsrq0',title:'Opening - personal video notes'};
 const newFile={...file,buffer:Buffer.from(JSON.stringify(fresh))};
 await p.locator('#passImpFile449').setInputFiles(newFile);await p.locator('#passportReview453').waitFor({state:'visible'});
 assert.equal(await p.evaluate(()=>document.getElementById('passportApply453').checkVisibility()),true);
 await p.setViewportSize({width:1200,height:900});
 await p.screenshot({path:'/tmp/r453/passport-review-en.png'});
 for(const lang of ['hi','gu']){
  await p.setViewportSize({width:390,height:844});await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.getElementById('langBtn').getAttribute('aria-busy')!=='true');
  assert.doesNotMatch(await p.locator('#passportReviewTitle453').textContent(),/Review video passport/);
  assert.equal(await p.locator('#passportReview453').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true,'no dialog overflow '+lang);
  await p.screenshot({path:'/tmp/r453/passport-review-'+lang+'.png'});
 }
 // Repaint on theme changes must keep real, clickable actions within the dialog.
 for(const cls of ['high-contrast','calm-motion','low-end']){await p.evaluate(cls=>document.documentElement.classList.add(cls),cls);assert.equal(await p.locator('#passportApply453').isVisible(),true);}
 await p.locator('#passportCancel453').click();assert.equal(await p.locator('#passportReview453').count(),0);
 console.log('PASS preview cancel/escape, no writes before apply, selective import, conflict guards, disabled empty apply, fresh and repeat loads, mini player, Hindi/Gujarati 390px');
}).catch(e=>{console.error(e);process.exitCode=1;});

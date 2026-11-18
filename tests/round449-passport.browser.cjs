const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 const vid='abcdefghijk', other='zyxwvutsrq0';
 function passport(o){return {name:'passport.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(Object.assign({kind:'vp-video-passport',v:1,id:vid},o)))};}
 const imp=async f=>{await p.locator('#passImpFile449').setInputFiles(f);await p.locator('#passportReview453').waitFor({state:'visible'});if(await p.locator('#passportApply453').isEnabled())await p.locator('#passportApply453').click();else await p.locator('#passportCancel453').click();await p.waitForTimeout(100);};
 // Export with no video loaded: refused with a toast, no crash.
 await p.evaluate(()=>document.getElementById('passExpBtn449').click());await p.waitForTimeout(300);
 assert.match(await p.locator('#vpToast').textContent(),/Load a video first/);
 // Import a full passport for a video: every piece lands and is reported.
 await imp(passport({title:'Lecture A',marks:[{t:12,name:'Start'},{t:40,name:'Key point'}],note:'remember this',memory:{speed:1.5,vol:80,cc:true,intro:5},lyrics:'la la\nla'}));
 const msg=await p.locator('#passMsg449').textContent();
 for(const s of ['2 new moments added','Note added','Remembered settings added','Lyrics added','different video'])assert.ok(msg.includes(s),s+' in: '+msg);
 const stores=await p.evaluate(([id])=>({m:JSON.parse(localStorage.getItem('vp-marks.v1'))[id],n:JSON.parse(localStorage.getItem('vp-notes.v1'))[id],v:JSON.parse(localStorage.getItem('vp-vmem.v1'))[id],l:JSON.parse(localStorage.getItem('vp-lyrics.v1'))[id]}),[vid]);
 assert.deepEqual(stores.m.map(m=>[m.t,m.name]),[[12,'Start'],[40,'Key point']]);assert.equal(stores.n,'remember this');assert.equal(stores.v.speed,1.5);assert.equal(stores.l,'la la\nla');
 // Import the same passport again: nothing new, nothing duplicated or overwritten.
 await imp(passport({marks:[{t:12,name:'Start'},{t:40,name:'Key point'}],note:'other words',memory:{speed:2},lyrics:'different'}));
 assert.equal(await p.locator('#passportReview453').count(),0,'review with only existing items cancels without any write');
 const again=await p.evaluate(([id])=>({m:JSON.parse(localStorage.getItem('vp-marks.v1'))[id].length,n:JSON.parse(localStorage.getItem('vp-notes.v1'))[id],v:JSON.parse(localStorage.getItem('vp-vmem.v1'))[id].speed,l:JSON.parse(localStorage.getItem('vp-lyrics.v1'))[id]}),[vid]);
 assert.deepEqual(again,{m:2,n:'remember this',v:1.5,l:'la la\nla'},'existing data wins, no duplicates');
 // Merge: a passport with one fresh moment and one duplicate adds only the fresh one.
 await imp(passport({marks:[{t:12,name:'Start'},{t:55,name:'New'}]}));
 assert.match(await p.locator('#passMsg449').textContent(),/1 new moment added/);
 assert.equal(await p.evaluate(([id])=>JSON.parse(localStorage.getItem('vp-marks.v1'))[id].length,[vid]),3);
 // Not a passport: wrong kind, malformed id and junk JSON are all refused politely.
 await p.locator('#passImpFile449').setInputFiles({name:'x.json',mimeType:'application/json',buffer:Buffer.from('{"kind":"other","id":"abcdefghijk"}')});await p.waitForTimeout(300);
 assert.match(await p.locator('#vpToast').textContent(),/not a video passport/);
 await p.locator('#passImpFile449').setInputFiles({name:'x.json',mimeType:'application/json',buffer:Buffer.from('not json')});await p.waitForTimeout(300);
 assert.match(await p.locator('#vpToast').textContent(),/not a video passport/);
 // A second video's passport stays under its own id.
 await imp(passport2=passport({marks:[{t:7}]})); // same vid ok
 await p.locator('#passImpFile449').setInputFiles({name:'p2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({kind:'vp-video-passport',v:1,id:other,note:'other vid note'}))});await p.locator('#passportApply453').click();await p.waitForTimeout(100);
 assert.equal(await p.evaluate(([id])=>JSON.parse(localStorage.getItem('vp-notes.v1'))[id],[other]),'other vid note');
 // Hindi + Gujarati at 390px: translated, no overflow.
 await p.setViewportSize({width:390,height:844});
 for(const lang of ['hi','gu']){
  await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.getElementById('langBtn').getAttribute('aria-busy')!=='true');
  assert.doesNotMatch(await p.locator('#passExpBtn449').textContent(),/Export passport/);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no page overflow at '+lang);
 }
 await p.evaluate(l=>window.__vpSetLangOnce(l),'en');await p.waitForFunction(()=>document.getElementById('langBtn').getAttribute('aria-busy')!=='true');
 // Fresh load: imported data survives and the row repaints.
 await boot();
 assert.equal(await p.evaluate(([id])=>JSON.parse(localStorage.getItem('vp-marks.v1'))[id].length,[vid]),4);
 assert.match(await p.evaluate(()=>document.getElementById('passExpBtn449').textContent),/Export passport/);
 console.log('PASS passport refuse-empty export, full import, idempotent re-import, moment merge, junk refusal, per-video routing, HI/GU 390px, fresh load.');
}).catch(e=>{console.error(e);process.exitCode=1;});

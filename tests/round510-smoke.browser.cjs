// Round 510: whole-app stability sweep - the missing net under every feature test.
// 1) Boot with zero page errors, cycle English -> Hindi -> Gujarati -> English with
//    live reloads and assert no page error appears at any step.
// 2) Gujarati untranslated-leak sweep: every visible chip, button, list heading and
//    summary must not be plain English (the first full-app sweep of this kind; the
//    allowlist names tokens that stay English by design).
// 3) Open all 160+ <details> blocks with a video loaded - no error, no stuck state.
// 4) Blind chip sweep: click every visible enabled chip, dismissing overlays between
//    clicks - the app must never throw, whatever order the chips fire in.
const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,errors})=>{
 await pick();
 const clickIf=async(sel)=>{const l=p.locator(sel);if(await l.count()&&await l.first().isVisible().catch(()=>false)){await l.first().click({timeout:1500}).catch(()=>{});return true;}return false;};
 await clickIf('#playbackCues509 > summary');
 await p.locator('#lpVideo').evaluate(v=>v.play());await p.waitForTimeout(400);
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(600);
 assert.deepEqual(errors,[],'page errors after basic interactions');
 // 1) language cycling
 for(const l of ['hi','gu','en']){
   await p.evaluate(x=>{const pr=JSON.parse(localStorage.getItem('vp-prefs.v1'));pr.lang=x;localStorage.setItem('vp-prefs.v1',JSON.stringify(pr));},l);
   await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await p.waitForTimeout(400);
 }
 assert.deepEqual(errors,[],'page errors after hi/gu/en cycling');
 // 2) Gujarati leak sweep
 await p.evaluate(()=>{const pr=JSON.parse(localStorage.getItem('vp-prefs.v1'));pr.lang='gu';localStorage.setItem('vp-prefs.v1',JSON.stringify(pr));});
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await p.waitForTimeout(700);
 const leaks=await p.evaluate(()=>{
   const out=[];const re=/^[A-Za-z][A-Za-z '&-]{8,60}$/;
   document.querySelectorAll('button.chip,button.btn,.lib-head h3,summary').forEach(el=>{
     if(!el.offsetParent)return;const t=(el.textContent||'').trim();
     if(re.test(t)&&!/YouTube|MP3|A-B|CSV|JSON|PNG|FAQ|QR|HD|A to Z|Auto-next/.test(t))out.push(t.slice(0,60));
   });
   return [...new Set(out)];
 });
 assert.deepEqual(leaks,[],'English-only labels leaking into the Gujarati UI: '+leaks.join(' | '));
 // 3) open every details
 const n=await p.locator('details').count();
 for(let i=0;i<n;i++){const d=p.locator('details').nth(i);if(await d.isVisible().catch(()=>false)){await d.evaluate(el=>{el.open=true;}).catch(()=>{});}}
 await p.waitForTimeout(400);
 assert.deepEqual(errors,[],'page errors after opening all details');
 // 4) blind chip sweep with overlay dismissal
 // Full-page mode toggles (simple mode, car mode), Collapse all and the PWA install
 // prompt hide or cover the rest of the page by design - their own feature tests cover
 // them; the sweep targets the other chips.
 const skip=new Set(['simpleModeBtn','carBtn287','installBtn','secAllBtn']);
 const ids=await p.evaluate(()=>[...document.querySelectorAll('button.chip')].filter(b=>b.offsetParent&&!b.disabled).map(b=>b.id).filter(Boolean));
 for(const k of skip){const i=ids.indexOf(k);if(i>=0)ids.splice(i,1);}
 assert.ok(ids.length>250,"expected 250+ chips, got "+ids.length);
 let clicked=0;
 for(const id of ids){
   const r=await p.evaluate(i=>{try{const b=document.getElementById(i);if(!b||!b.offsetParent||b.disabled)return 'gone';b.click();return 'ok';}catch(e){return 'throw:'+e.message}},id);
   assert.ok(!r.startsWith('throw'),'chip #'+id+' threw: '+r);
   if(r==='ok')clicked++;
   if(r==='ok'){await p.keyboard.press('Escape').catch(()=>{});await p.evaluate(()=>{
     document.querySelectorAll('dialog[open]').forEach(d=>{try{d.close()}catch(e){}});
     const c=document.getElementById('vpPalClose');if(c&&c.offsetParent)c.click();
     const t=document.getElementById('vpToast');if(t)t.remove();
   }).catch(()=>{});}
   if(errors.length)break;
   await p.waitForTimeout(15);
 }
 assert.deepEqual(errors,[],'page errors during the chip sweep');
 console.log('PASS round510 smoke: language cycling, Gujarati leak sweep, '+n+' details, chip sweep ('+clicked+' clicked) - zero page errors');
}).catch(e=>{console.error(e);process.exitCode=1;});

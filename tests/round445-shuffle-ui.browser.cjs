const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');await p.locator('#loadBtn').click();await p.locator('#frameBox iframe').waitFor({state:'attached'});await p.evaluate(()=>{const f=document.querySelector('#frameBox iframe');for(const [event,info] of [['onReady',null],['infoDelivery',{currentTime:8,duration:213}],['onStateChange',1]])window.dispatchEvent(new MessageEvent('message',{source:f.contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}}));});
 // Existing iframe is allowed to be a test frame; media itself is a real decoded local MP4.
 await pick();await p.locator('#lpVideo').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#playerDock').classList.contains('is-mini'));await p.locator('#localShuffleJourney445').evaluate(e=>e.open=true);await p.locator('#lpShuffleBtn').click();assert.equal(await p.locator('#playerDock').evaluate(e=>e.classList.contains('is-mini')),true);await p.locator('#lpNext').click();await p.waitForFunction(()=>document.querySelector('#lpVideo').readyState>=2);
 await p.locator('#lpVideo').scrollIntoViewIfNeeded();
 await p.locator('#localShuffleJourney445').evaluate(e=>e.open=true);
 await p.locator('#localQueueEditor443').evaluate(e=>e.open=false);
 for(const lang of ['en','hi','gu']){
  await p.setViewportSize({width:390,height:844});await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.querySelector('#langBtn').getAttribute('aria-busy')!=='true');
  await p.locator('#lpVideo').evaluate(v=>{v.currentTime=8;});await p.locator('#localShuffleJourney445').scrollIntoViewIfNeeded();
  assert.equal(await p.locator('#localShuffleJourney445').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  if(lang!=='en')assert.doesNotMatch(await p.locator('#lsjTitle445').textContent(),/Local shuffle/);
  await p.locator('#lpPrev').click();await p.locator('#lpNext').click();
  await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#localShuffleJourney445').evaluate(e=>window.scrollTo({top:scrollY+e.getBoundingClientRect().top-210,behavior:'instant'}));await p.waitForTimeout(450);await p.screenshot({path:'/downloads/round445-journey-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});
 await p.locator('#lpPrev').click();await p.locator('#lpNext').click();await p.screenshot({path:'/downloads/round445-journey-dark.png'});
 console.log('PASS: new journey in EN/HI/GU 390px, overflow, translated dynamic labels, Previous/Next, dark/high-contrast/Calm/Low-end.');
}).catch(e=>{console.error(e);process.exitCode=1;});

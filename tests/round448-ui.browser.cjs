const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#wipeOpen448').click();await p.locator('#soundCompare448').evaluate(e=>e.open=true);await p.locator('#acBlend448').click();
 for(const lang of ['en','hi','gu']){
  await p.setViewportSize(lang==='en'?{width:1280,height:1600}:{width:390,height:1900});await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.querySelector('#langBtn').getAttribute('aria-busy')!=='true');
  if(lang!=='en'){assert.doesNotMatch(await p.locator('#liveWipe448 h4').textContent(),/Live wipe/);assert.doesNotMatch(await p.locator('#soundCompare448 summary').textContent(),/Compare soundtracks/);}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No page overflow at '+lang);for(const id of ['liveWipe448','soundCompare448'])assert.equal(await p.locator('#'+id).evaluate(e=>e.scrollWidth<=e.clientWidth+1),true,'No feature overflow at '+lang);
  await p.locator('#pairStage446').evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-100,behavior:'instant'}));await p.mouse.move(0,0);await p.waitForTimeout(1700);await p.screenshot({path:'/downloads/round448-live-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});
 await p.locator('#wipePosition448').fill('70');await p.locator('#wipePosition448').dispatchEvent('input');await p.locator('#acMain448').click();await p.locator('#wipePlay448').click();await p.waitForFunction(()=>['lpVideo','lcVideo445'].every(id=>!document.getElementById(id).paused));await p.locator('#wipePause448').click();await p.locator('#pairStage446').evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-100,behavior:'instant'}));await p.mouse.move(0,0);await p.waitForTimeout(1700);await p.screenshot({path:'/downloads/round448-live-contrast.png'});
 await p.locator('#lcFollow445').uncheck();await p.locator('#lcVideo445').evaluate(v=>v.play());await p.locator('#localCompare445').evaluate(e=>e.open=false);await p.waitForFunction(()=>document.querySelector('#lcVideo445').paused);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.controls),true);
 console.log('PASS live EN/HI/GU, 390px no overflow, dark/high contrast/Calm/Low-end controls, collapse pauses and restores controls.');
}).catch(e=>{console.error(e);process.exitCode=1;});

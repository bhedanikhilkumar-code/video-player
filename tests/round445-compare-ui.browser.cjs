const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=7);await p.locator('#lcAlign445').click();
 for(const lang of ['en','hi','gu']){
  await p.setViewportSize({width:390,height:1100});await p.evaluate(l=>window.__vpSetLangOnce(l),lang);await p.waitForFunction(()=>document.querySelector('#langBtn').getAttribute('aria-busy')!=='true');
  assert.equal(await p.locator('#localCompare445').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  if(lang!=='en')assert.doesNotMatch(await p.locator('#lcTitle445').textContent(),/Compare two/);
  await p.locator('#localCompare445').evaluate(e=>window.scrollTo({top:scrollY+e.getBoundingClientRect().top-210,behavior:'instant'}));await p.waitForTimeout(450);await p.screenshot({path:'/downloads/round445-compare-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});await p.locator('#lcFollow445').check();await p.locator('#lcFollow445').uncheck();
 await p.locator('#lcVideo445').evaluate(v=>{v.muted=true;return v.play();});await p.locator('#localCompare445').evaluate(e=>e.open=false);await p.waitForFunction(()=>document.querySelector('#lcVideo445').paused);
 console.log('PASS: local comparison EN/HI/GU at 390px, no overflow, dark/contrast/Calm/Low-end, collapse stops reference.');
}).catch(e=>{console.error(e);process.exitCode=1;});

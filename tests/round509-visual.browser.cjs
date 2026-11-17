const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,origin})=>{
 await p.setViewportSize({width:1280,height:900});await pick();await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#playbackCues509 summary').click();
 const add=async(n,t,a,val)=>{await p.locator('#pcName509').fill(n);await p.locator('#pcTime509').fill(t);await p.locator('#pcAction509').selectOption(a);if(val)await p.locator('#pcValue509').selectOption(val);await p.locator('#pcAdd509').click();};
 await add('Listen closely','5','rate','0.75');await add('Quiet passage','12','volume','0.25');await add('Take a breath','20','pause');
 for(const lang of ['en','hi','gu']){
  if(lang!=='en'){await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l,lang);await p.waitForTimeout(3200);}
  if(lang!=='en')await p.setViewportSize({width:390,height:844});
  await p.locator('#playbackCues509').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.waitForTimeout(600);await p.locator('#pcName509').scrollIntoViewIfNeeded();await p.waitForTimeout(300);assert.ok(await p.locator('#pcAdd509').isVisible());
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.ok(await p.locator('#lpVideo').evaluate(v=>v.readyState>=2));
  await p.screenshot({path:'/downloads/r509-cues-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});
 assert.ok(await p.locator('#pcAdd509').isVisible());await p.screenshot({path:'/downloads/r509-cues-contrast.png'});
 console.log('PASS cue visuals: device frame, mini/dock, English desktop, Hindi/Gujarati 390px and contrast');
}).catch(e=>{console.error(e);process.exitCode=1;});

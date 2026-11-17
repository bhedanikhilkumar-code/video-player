const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,origin})=>{
 await p.setViewportSize({width:1280,height:1000});await pick();await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=3;});await p.locator('#playbackCues509 > summary').click();
 for(const c of [{name:'Listen closely',t:'4.25',a:'rate',val:'0.75'},{name:'Skip the break',t:'12.5',a:'seek',val:'18.75'},{name:'Pause and reflect',t:'25',a:'pause'}]){await p.locator('#pcName509').fill(c.name);await p.locator('#pcTime509').fill(c.t);await p.locator('#pcAction509').selectOption(c.a);if(c.a==='seek')await p.locator('#pcSeekVal509').fill(c.val);else if(c.val)await p.locator('#pcValue509').selectOption(c.val);await p.locator('#pcAdd509').click();}
 await p.locator('#pcTiming513 > summary').click();await p.locator('#ctShift513').fill('-1.25');await p.locator('#ctTargets513').check();await p.locator('#ctPreview513').click();
 const dock=async()=>{await p.locator('#help').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY));await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));await p.locator('#pcTiming513').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.waitForTimeout(350);assert.ok(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')));assert.ok(await p.locator('#lpVideo').evaluate(v=>v.readyState>=2));};
 await dock();await p.screenshot({path:'/downloads/r513-live-shift-en.png'});
 await p.locator('#ctMethod513').selectOption('align');await p.locator('#ctOldA513').fill('2');await p.locator('#ctOldB513').fill('22');await p.locator('#ctNewA513').fill('4');await p.locator('#ctNewB513').fill('18');await p.locator('#ctPreview513').click();await dock();await p.screenshot({path:'/downloads/r513-live-align-en.png'});
 for(const lang of ['hi','gu']){
  await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l,lang);await p.waitForTimeout(3200);await p.setViewportSize({width:390,height:844});
  await p.locator('#ctMethod513').selectOption('shift');await p.locator('#ctShift513').fill('-1.25');await p.locator('#ctPreview513').click();await dock();await p.locator('#ctReview513').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-125));await p.waitForTimeout(300);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow '+lang);assert.ok(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')));assert.ok(await p.evaluate(()=>document.querySelector('#ctApply513').getBoundingClientRect().bottom < document.querySelector('#lpViewWrap').getBoundingClientRect().top),'review actions visible above dock');assert.ok(!/Preview timing changes|Review cue timing|Before:|After:/.test(await p.locator('#pcTiming513').textContent()),'new copy translated '+lang);
  await p.screenshot({path:'/downloads/r513-live-shift-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});
 await p.locator('#ctApply513').click();await p.locator('#ctUndo513').scrollIntoViewIfNeeded();await p.waitForTimeout(300);assert.equal(await p.locator('#ctUndo513').isVisible(),true);await p.screenshot({path:'/downloads/r513-live-undo-contrast.png'});
 // An already-loaded device file and timing review work without a network.
 await p.context().setOffline(true);await p.locator('#ctUndo513').click();await p.locator('#ctShift513').fill('1');await p.locator('#ctPreview513').click();assert.equal(await p.locator('#ctReview513').isVisible(),true);await p.locator('#ctApply513').click();await p.context().setOffline(false);
 console.log('PASS visual/offline flow '+origin+': docked device video; EN shift/align, HI/GU 390px, contrast/Calm/Low-end, Undo and offline timing');
}).catch(e=>{console.error(e);process.exitCode=1;});

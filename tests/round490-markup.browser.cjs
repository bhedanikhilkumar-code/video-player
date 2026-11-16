const assert=require('node:assert/strict'),fs=require('node:fs'),languageTap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=4;});await p.waitForFunction(()=>!document.querySelector('#lpVideo').seeking);
 await p.locator('#fmCapture490').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),true);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.ok((await p.locator('#frameMarkup490 > [role=status]').textContent()).includes('0:04'));
 const hash=()=>p.locator('#fmCanvas490').evaluate(c=>c.toDataURL());const original=await hash();
 await p.locator('#fmText490').fill('Look here');await p.locator('#fmCentre490').click();assert.notEqual(await hash(),original);assert.equal(await p.locator('#fmUndo490').isEnabled(),true);await p.locator('#fmUndo490').click();assert.equal(await hash(),original);
 for(const tool of ['pen','rect','arrow','text']){
  await p.locator('#fmTool490').selectOption(tool);await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();let r=await p.locator('#fmCanvas490').boundingBox();await p.mouse.move(r.x+r.width*.3,r.y+r.height*.35);await p.mouse.down();await p.mouse.move(r.x+r.width*.65,r.y+r.height*.65,{steps:8});await p.mouse.up();
 }
 assert.ok((await p.locator('#frameMarkup490').textContent()).includes('Marks: 4 of 60'));
 await p.locator('#fmColour490').selectOption('#ffdf4f');await p.locator('#fmWidth490').fill('12');
 const downloading=p.waitForEvent('download');await p.locator('#fmSave490').click();let d=await downloading;await d.saveAs('/downloads/round490-marked-frame.png');assert.equal(d.suggestedFilename(),'video-frame-4000-marked.png');assert.ok(fs.statSync('/downloads/round490-marked-frame.png').size>1000);
 await p.locator('#fmClear490').click();assert.equal(await hash(),original);
 await p.locator('#fmCentre490').click();p.once('dialog',d=>d.dismiss());await p.locator('#fmCapture490').click();assert.ok((await p.locator('#frameMarkup490').textContent()).includes('Marks: 1 of 60'));
 p.once('dialog',d=>d.accept());await p.locator('#fmCapture490').click();assert.equal(await hash(),original);
 // Soft pause must not let the live image run another 300ms after capture.
 await p.locator('#lpSoftBtn').click();await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#fmCapture490').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);
 await p.locator('#fmText490').fill('Frame detail');await p.locator('#fmCentre490').click();
 await p.setViewportSize({width:390,height:844});
 for(const lang of ['en','hi','gu']){
  for(let i=0;i<3&&await p.locator('html').getAttribute('lang')!==lang;i++)await languageTap(p);
  await p.locator('#frameMarkup490').scrollIntoViewIfNeeded();assert.ok(await p.locator('#frameMarkup490').evaluate(e=>e.scrollWidth<=e.clientWidth+1));assert.equal(await p.locator('#fmText490').inputValue(),'Frame detail');
  await p.screenshot({path:'/downloads/round490-markup-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx')});await p.locator('#fmCentre490').click();assert.equal(await p.locator('#fmSave490').isEnabled(),true);
 await p.locator('#fmDiscard490').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),false);
 await p.locator('#fmCapture490').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),true);
 // Draft is intentionally ephemeral, with no new storage or saved preferences.
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();assert.equal(await p.locator('#fmCanvas490').isVisible(),false);
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#frameMarkup490').count(),1);
 console.log('PASS frame capture, all four tools, stroke controls, undo, clear, cancel/confirm replacement, PNG, immediate soft pause, 390px en/hi/gu, dark/contrast/calm/low-end, discard, fresh/repeat reset');
}).catch(e=>{console.error(e);process.exitCode=1});

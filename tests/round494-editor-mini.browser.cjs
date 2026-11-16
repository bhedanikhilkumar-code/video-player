const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await p.setViewportSize({width:390,height:844});await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#frameMarkup490>summary').click();await p.locator('#fmCapture490').click();await p.locator('#fmCrop492>summary').click();await p.locator('#fmCrop492').scrollIntoViewIfNeeded();await p.waitForTimeout(400);
 assert.equal(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')),false,'captured-image editor controls must not be covered by local mini player');
 await p.locator('#fmCropApply492').scrollIntoViewIfNeeded();const hit=await p.locator('#fmCropApply492').evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert.equal(hit,true,'crop button must be hittable while image editor is open');
 await p.locator('#frameMarkup490>summary').click();await p.locator('#help').scrollIntoViewIfNeeded().catch(()=>p.evaluate(()=>scrollTo(0,document.body.scrollHeight)));await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));
 console.log('PASS editor is not covered by mini, crop button hittable, mini resumes after editor closes');
}).catch(e=>{console.error(e);process.exitCode=1});

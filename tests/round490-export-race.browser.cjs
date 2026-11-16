const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 summary').click();
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=4});await p.waitForFunction(()=>!document.querySelector('#lpVideo').seeking);await p.locator('#fmCapture490').click();
 await p.locator('#fmCanvas490').evaluate(c=>{const real=c.toBlob.bind(c);c.toBlob=(callback,...args)=>real(blob=>{window.finishFrameExport490=()=>callback(blob)},...args)});
 await p.locator('#fmSave490').click();await p.waitForFunction(()=>window.finishFrameExport490);
 await p.locator('#lpVideo').evaluate(v=>{v.currentTime=10});await p.waitForFunction(()=>!document.querySelector('#lpVideo').seeking);await p.locator('#fmCapture490').click();
 const downloaded=p.waitForEvent('download');await p.evaluate(()=>window.finishFrameExport490());const d=await downloaded;assert.equal(d.suggestedFilename(),'video-frame-4000-marked.png','delayed PNG retains the timestamp of the exported image, not a newer capture');
 console.log('PASS delayed PNG encoding preserves the original capture timestamp after recapture');
}).catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 summary').click();await p.locator('#fmCapture490').click();
 const dims=await p.locator('#fmCanvas490').evaluate(c=>({w:c.width,h:c.height}));
 await p.evaluate(()=>{window.__vpFrameGalAdd=async(blob,w,h)=>{window.saved492={w,h,size:blob.size}};const c=document.querySelector('#fmCanvas490'),real=c.toBlob.bind(c);c.toBlob=(cb,...args)=>real(blob=>{window.finish492=()=>cb(blob)},...args)});
 await p.locator('#fmKeep490').click();await p.waitForFunction(()=>window.finish492);await p.locator('#fmDiscard490').click();await p.evaluate(()=>window.finish492());
 assert.deepEqual(await p.evaluate(()=>({w:saved492.w,h:saved492.h})),dims,'gallery metadata must describe the encoded image, not the discarded canvas');
 console.log('PASS gallery keeps encoded image dimensions after discard during PNG encoding');
}).catch(e=>{console.error(e);process.exitCode=1});

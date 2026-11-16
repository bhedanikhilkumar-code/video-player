const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490>summary').click();await p.locator('#fmCapture490').click();await p.locator('#fmTool490').selectOption('crop');
 await p.locator('#fmCanvas490').evaluate(c=>{const r=c.getBoundingClientRect(),event=(type,x,y)=>new PointerEvent(type,{bubbles:true,pointerId:71,button:0,clientX:r.left+x/c.width*r.width,clientY:r.top+y/c.height*r.height});c.dispatchEvent(event('pointerdown',50,40));window.dispatchEvent(event('pointermove',100,90));window.dispatchEvent(event('pointerup',200,160));});
 assert.equal(await p.locator('#fmCropW492').inputValue(),'150','crop must include the release position, not stop at last move');assert.equal(await p.locator('#fmCropH492').inputValue(),'120');
 await p.locator('#fmTool490').selectOption('cover');await p.locator('#fmCanvas490').evaluate(c=>{const r=c.getBoundingClientRect(),event=(type,x,y)=>new PointerEvent(type,{bubbles:true,pointerId:72,button:0,clientX:r.left+x/c.width*r.width,clientY:r.top+y/c.height*r.height});c.dispatchEvent(event('pointerdown',300,100));window.dispatchEvent(event('pointermove',350,150));window.dispatchEvent(event('pointerup',400,200));});
 assert.deepEqual(await p.locator('#fmCanvas490').evaluate(c=>[...c.getContext('2d').getImageData(390,190,1,1).data]),[0,0,0,255]);
 console.log('PASS crop and privacy rectangle include final release coordinates after coalesced move');
}).catch(e=>{console.error(e);process.exitCode=1});

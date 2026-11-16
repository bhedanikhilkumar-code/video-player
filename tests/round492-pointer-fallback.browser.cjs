const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 summary').click();await p.locator('#fmCapture490').click();
 await p.locator('#fmCanvas490').evaluate(c=>{c.setPointerCapture=()=>{throw new DOMException('No active pointer','NotFoundError')};let r=c.getBoundingClientRect();c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:492,button:0,clientX:r.x+r.width*.2,clientY:r.y+r.height*.2}));window.dispatchEvent(new PointerEvent('pointermove',{pointerId:492,clientX:r.right+20,clientY:r.bottom+20}));window.dispatchEvent(new PointerEvent('pointerup',{pointerId:492}));});
 assert.equal(await p.locator('#fmSave490').isEnabled(),true,'release outside the canvas must end a stroke even if capture failed');assert.ok((await p.locator('#frameMarkup490').textContent()).includes('Marks: 1 of 60'));
 await p.locator('#fmCanvas490').evaluate(c=>{c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:493,button:0}));window.dispatchEvent(new Event('blur'));});assert.equal(await p.locator('#fmSave490').isEnabled(),true,'tab/window loss must cancel the draft');
 console.log('PASS failed pointer capture ends on outside release and cancels on window blur');
}).catch(e=>{console.error(e);process.exitCode=1});

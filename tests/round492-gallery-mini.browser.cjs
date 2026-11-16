const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.setViewportSize({width:390,height:844});await p.locator('#lpGal285 > summary').click();await p.locator('#lpGalAdd285').click();await p.waitForFunction(()=>document.querySelector('#lpGalGrid285 button'));await p.locator('#lpGalGrid285 button').click();await p.waitForFunction(()=>document.querySelector('#lpGalView285').open);await p.evaluate(()=>window.dispatchEvent(new Event('resize')));
 assert.equal(await p.locator('#lpViewWrap').evaluate(e=>e.classList.contains('lpMini447')),false,'floating device video must not sit above the frame modal');await p.locator('#lpGalName492').fill('Frame detail');await p.keyboard.press('Escape');assert.equal(await p.locator('#lpGalView285').isVisible(),false);
 console.log('PASS frame preview owns the top layer at 390px and closes normally');
}).catch(e=>{console.error(e);process.exitCode=1});

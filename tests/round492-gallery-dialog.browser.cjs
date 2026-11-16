const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#lpGal285 > summary').click();await p.locator('#lpGalAdd285').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285 button').length===1);await p.locator('#lpGalGrid285 button').focus();await p.keyboard.press('Enter');
 assert.equal(await p.locator('#lpGalView285').evaluate(e=>e.contains(document.activeElement)),true,'viewer must move keyboard focus inside');
 for(let i=0;i<8;i++){await p.keyboard.press('Tab');assert.equal(await p.locator('#lpGalView285').evaluate(e=>e.contains(document.activeElement)),true,'Tab must not reach controls behind the preview');}
 await p.keyboard.press('Escape');assert.equal(await p.locator('#lpGalView285').isVisible(),false);assert.equal(await p.locator('#lpGalGrid285 button').evaluate(e=>e===document.activeElement),true,'closing must return focus to the thumbnail');
 console.log('PASS saved frame modal focus, tab containment, Escape and thumbnail focus restoration');
}).catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#lpGal285 > summary').click();await p.locator('#lpGalAdd285').click();await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285 button').length===1);
 const name=await p.locator('#lpGalGrid285 button').getAttribute('aria-label');assert.ok(name&&name.length>10,'a saved frame thumbnail needs a meaningful screen-reader name, not an empty button');
 await p.locator('#lpGalGrid285 button').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#lpGalView285').isVisible(),true);console.log('PASS named gallery thumbnail opens with keyboard');
}).catch(e=>{console.error(e);process.exitCode=1});

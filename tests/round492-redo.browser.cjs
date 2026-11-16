const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 > summary').click();await p.locator('#fmCapture490').click();const hash=()=>p.locator('#fmCanvas490').evaluate(c=>c.toDataURL()),original=await hash();await p.locator('#fmText490').fill('First');await p.locator('#fmCentre490').click();const first=await hash();assert.notEqual(first,original);
 await p.locator('#fmUndo490').click();assert.equal(await hash(),original);await p.locator('#fmRedo492').click();assert.equal(await hash(),first);
 await p.locator('#fmClear490').click();assert.equal(await hash(),original);await p.locator('#fmUndo490').click();assert.equal(await hash(),first);await p.locator('#fmRedo492').click();assert.equal(await hash(),original);await p.locator('#fmUndo490').click();
 await p.locator('#fmUndo490').focus();await p.keyboard.press('Control+z');assert.equal(await hash(),original);await p.keyboard.press('Control+Shift+z');assert.equal(await hash(),first);await p.keyboard.press('Control+z');await p.keyboard.press('Control+y');assert.equal(await hash(),first);
 await p.locator('#fmUndo490').click();await p.locator('#fmText490').fill('Second');await p.locator('#fmCentre490').click();assert.equal(await p.locator('#fmRedo492').isEnabled(),false,'new edits fork history');assert.notEqual(await hash(),first);
 await p.locator('#fmClear490').click();await p.locator('#fmCapture490').click();assert.equal(await p.locator('#fmUndo490').isEnabled(),false);assert.equal(await p.locator('#fmRedo492').isEnabled(),false);
 console.log('PASS undo/redo exact pixels, undo Clear all, scoped Ctrl Z/Shift Z/Y, fork clears redo, recapture clears history');
}).catch(e=>{console.error(e);process.exitCode=1});

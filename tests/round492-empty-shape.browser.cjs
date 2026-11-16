const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#frameMarkup490 summary').click();await p.locator('#fmCapture490').click();
 for(const tool of ['rect','cover']){await p.locator('#fmTool490').selectOption(tool);await p.locator('#fmCanvas490').click({position:{x:40,y:40}});assert.equal(await p.locator('#fmUndo490').isEnabled(),false,'a tap creates no visible area and must not consume one of 60 marks');}
 await p.locator('#fmCanvas490').scrollIntoViewIfNeeded();const r=await p.locator('#fmCanvas490').boundingBox();await p.mouse.move(r.x+40,r.y+40);await p.mouse.down();await p.mouse.move(r.x+140,r.y+100);await p.mouse.up();assert.equal(await p.locator('#fmUndo490').isEnabled(),true);assert.ok((await p.locator('#frameMarkup490').textContent()).includes('Marks: 1 of 60'));
 console.log('PASS rectangle and privacy tap create no invisible marks; a real area still saves');
}).catch(e=>{console.error(e);process.exitCode=1});

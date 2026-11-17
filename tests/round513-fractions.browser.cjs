const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#playbackCues509 > summary').click();await p.locator('#pcTime509').fill('1.25');await p.locator('#pcAction509').selectOption('seek');await p.locator('#pcSeekVal509').fill('8.75');await p.locator('#pcAdd509').click();
 const text=await p.locator('#pcList509').textContent();assert.match(text,/Jump to time: 0:08\.75/,'visible destination must retain the chosen fraction');
 await p.locator('#pcExchange509 > summary').click();await p.locator('#pcSave509').click();await p.locator('#pcRecall509').click();assert.match(await p.locator('#pcReviewList509').textContent(),/0:08\.75/);
 const fs=require('fs');const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#pcExport509').click()]);const doc=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));doc.cues[0].value=8.999;await p.locator('#pcReject509').click();await p.locator('#pcFile509').setInputFiles({name:'fraction.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(doc))});assert.match(await p.locator('#pcReviewList509').textContent(),/Jump to time: 0:09/);await p.locator('#pcApply509').click();assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).cues[0].value,9,'import normalizes destination to editor precision');
 console.log('PASS fractional cue targets in list, saved review and normalized import');
}).catch(e=>{console.error(e);process.exitCode=1;});

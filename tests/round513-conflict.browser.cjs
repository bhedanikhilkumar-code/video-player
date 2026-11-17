const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#playbackCues509 > summary').click();
 const add=async(a)=>{await p.locator('#pcTime509').fill('2');await p.locator('#pcAction509').selectOption(a);if(a==='seek')await p.locator('#pcSeekVal509').fill('8');await p.locator('#pcAdd509').click();};
 await add('pause');await add('seek');assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).cues.length,1,'pause and jump at identical time must not silently cancel one another');
 assert.match(await p.locator('#pcStatus509').textContent(),/pause or jump/);
 // Speed and volume may still coexist with the transport action.
 await add('rate');assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).cues.length,2);
 const exported=await Promise.all([p.waitForEvent('download'),p.locator('#pcExchange509 > summary').click().then(()=>p.locator('#pcExport509').click())]);
 const fs=require('fs');const doc=JSON.parse(fs.readFileSync(await exported[0].path(),'utf8'));doc.cues.push({time:2,name:'Conflicting jump',action:'seek',value:8});
 await p.locator('#pcFile509').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(doc))});assert.equal(await p.locator('#pcReview509').isVisible(),false,'conflicting import refused');assert.equal((await p.evaluate(()=>window.__vpCues509.snapshot())).cues.length,2);
 console.log('PASS transport conflict validation: add and import reject, speed can coexist');
}).catch(e=>{console.error(e);process.exitCode=1;});

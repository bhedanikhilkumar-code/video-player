const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>{v.currentTime=8;window.__src445=v.src;});
 await p.locator('#lpFile').setInputFiles([]);
 assert.deepEqual(await p.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name)),files.map(f=>f.name),'Cancelling an empty picker must keep the queue');
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.src===window.__src445),true);assert.equal(await p.locator('#lpPickName').textContent(),'4 files chosen');
 await p.locator('#lpNext').click();await p.waitForFunction(()=>window.vpLocalPlan276().index===1);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.dataset.fileName276),'Middle.mp4');
 for(let n=0;n<2;n++){await boot();assert.equal(await p.evaluate(()=>window.vpLocalPlan276().files.length),0);await pick(files.slice(0,1));await p.locator('#lpFile').setInputFiles([]);assert.equal(await p.locator('#lpPickName').textContent(),'Opening.mp4');}
 console.log('PASS: empty/cancelled file picker preserves playing source, queue, count and Next; fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});

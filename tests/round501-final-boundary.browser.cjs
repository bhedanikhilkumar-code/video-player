const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,errors})=>{
 await pick(files.slice(0,2));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});await p.locator('#clipItinerary500>summary').click();
 const source=await p.locator('#lpVideo').getAttribute('src');
 await p.locator('#ciName500').fill('Final instant');await p.locator('#ciStart500').fill('34.3');await p.locator('#ciEnd500').fill('35');await p.locator('#ciAdd500').click();await p.locator('#ciPlay500').click();await p.waitForTimeout(2000);
 console.log('source unchanged',source===await p.locator('#lpVideo').getAttribute('src'),'state',await p.locator('#ciStatus500').textContent(),'time',await p.locator('#lpVideo').evaluate(v=>v.currentTime));assert.equal(await p.locator('#lpVideo').getAttribute('src'),source);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.match(await p.locator('#ciStatus500').textContent(),/finished/);assert.deepEqual(errors,[]);
 console.log('PASS final itinerary boundary does not auto advance the file queue');
}).catch(e=>{console.error(e);process.exitCode=1;});

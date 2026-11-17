const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-tabs-a');await p.waitForFunction(()=>window.__vpMainOk325);
 const b=await c.newPage();await b.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-tabs-b');await b.waitForFunction(()=>window.__vpMainOk325);
 await p.locator('#cvdChips503 [data-k="tri"]').click();await p.locator('#cvdStr503 [data-s="3"]').click();
 await b.waitForFunction(()=>document.querySelector('#cvdChips503 [data-k="tri"]').getAttribute('aria-pressed')==='true');
 assert.equal(await b.locator('#cvdStr503 [data-s="3"]').getAttribute('aria-pressed'),'true');assert.match(await b.evaluate(()=>document.documentElement.style.getPropertyValue('--vp-cvd')),/url/);
 await p.locator('#cvdSim503').click();await b.waitForFunction(()=>document.querySelector('#cvdSim503').getAttribute('aria-pressed')==='true');
 await p.locator('#cvdChips503 [data-k="off"]').click();await b.waitForFunction(()=>document.querySelector('#cvdStr503').hidden);assert.equal(await b.evaluate(()=>document.documentElement.style.getPropertyValue('--vp-cvd')),'brightness(1)');
 await b.close();console.log('PASS actual colour-vision choice, strength, simulation and Off follow between open tabs without reload');
}).catch(e=>{console.error(e);process.exitCode=1;});

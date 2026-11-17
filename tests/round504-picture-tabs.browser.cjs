const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-look-a');await p.waitForFunction(()=>window.__vpMainOk325);const b=await c.newPage();await b.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-look-b');await b.waitForFunction(()=>window.__vpMainOk325);
 await p.locator('#lookChips [data-id="bw"]').click();await b.waitForFunction(()=>document.querySelector('#lookChips [data-id="bw"]').getAttribute('aria-pressed')==='true',{},{timeout:5000});
 assert.match(await b.evaluate(()=>document.documentElement.style.getPropertyValue('--vp-look')),/grayscale/);
 await p.locator('#lookChips [data-id="normal"]').click();await b.waitForFunction(()=>document.querySelector('#lookChips [data-id="normal"]').getAttribute('aria-pressed')==='true',{},{timeout:5000});await b.close();console.log('PASS picture look filter and active controls follow between open tabs');
}).catch(e=>{console.error(e);process.exitCode=1;});

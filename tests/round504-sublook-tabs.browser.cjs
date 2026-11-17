const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-subtabs-a');await p.waitForFunction(()=>window.__vpMainOk325);const b=await c.newPage();await b.goto(origin+'/?v=dQw4w9WgXcQ&cb=504-subtabs-b');await b.waitForFunction(()=>window.__vpMainOk325);
 await p.locator('#subLookCol503 [data-v="y"]').click();await p.locator('#subLookBg503 [data-v="solid"]').click();
 await b.waitForFunction(()=>document.querySelector('#subLookCol503 [data-v="y"]').getAttribute('aria-pressed')==='true'&&document.querySelector('#subLookBg503 [data-v="solid"]').getAttribute('aria-pressed')==='true');
 assert.equal(await b.locator('#subOv314').evaluate(v=>getComputedStyle(v).color),'rgb(255, 230, 0)');assert.equal(await b.locator('#subOv314').evaluate(v=>getComputedStyle(v).backgroundColor),'rgb(0, 0, 0)');
 await p.locator('#subLookCol503 [data-v="w"]').click();await p.locator('#subLookBg503 [data-v="glass"]').click();await b.waitForFunction(()=>document.querySelector('#subLookCol503 [data-v="w"]').getAttribute('aria-pressed')==='true'&&document.querySelector('#subLookBg503 [data-v="glass"]').getAttribute('aria-pressed')==='true');
 await b.close();console.log('PASS actual own-caption colour/backing choices and return to defaults follow between open tabs');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict');
require('./round518-harness.cjs')(async({p,open,rows,origin})=>{
 await open();await p.locator('#remTime517').fill('23:57');await p.locator('#remSet517').click();await p.locator('#remSet517').click();
 assert.equal((await rows()).length,1,'same video and clock time must occupy one slot');assert.match(await p.locator('#remMsg517').textContent(),/already/i);
 console.log('PASS reminder duplicate rejection '+origin);
}).catch(e=>{console.error(e);process.exitCode=1;});

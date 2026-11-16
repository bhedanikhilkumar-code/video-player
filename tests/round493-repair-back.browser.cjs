const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,2));
 await p.evaluate(()=>{const b=document.getElementById('offlineRepairBack437');if(b)b.click();});
 await p.waitForTimeout(100);
 assert.ok(await p.evaluate(()=>window.__vpMainOk325));
 console.log('PASS repair Back button does not throw when no file choice exists');
}).catch(e=>{console.error(e);process.exitCode=1});

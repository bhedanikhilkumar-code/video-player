const assert=require('node:assert/strict');
require('./round518-harness.cjs')(async({p,open,rows,origin})=>{
 await open();await p.locator('#remVid517').selectOption('9bZkp7q19f0');await p.locator('#langBtn').click();await p.waitForTimeout(2200);
 assert.equal(await p.locator('#remVid517').inputValue(),'9bZkp7q19f0','language repaint must preserve the chosen video');
 await p.locator('#remQ1h517').click();assert.equal((await rows())[0].id,'9bZkp7q19f0');
 await p.locator('#remindCard517 > summary').click();await open();assert.equal(await p.locator('#remVid517').inputValue(),'9bZkp7q19f0','reopening must preserve selection');
 console.log('PASS reminder video selection '+origin);
}).catch(e=>{console.error(e);process.exitCode=1;});

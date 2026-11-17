const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 await p.locator('#palBtn').focus();
 await p.evaluate(()=>window.__vpSwitch506.open());
 for(let i=0;i<4;i++){
  await p.keyboard.press('Tab');
  assert.ok(await p.evaluate(()=>!!document.activeElement.closest('#rswCard506')),'Tab escaped modal');
 }
 await p.keyboard.press('Shift+Tab');
 assert.ok(await p.evaluate(()=>!!document.activeElement.closest('#rswCard506')),'Shift+Tab escaped modal');
 await p.keyboard.press('Escape');
 assert.equal(await p.evaluate(()=>document.activeElement.id),'palBtn','focus not returned');
 console.log('PASS recent switcher keyboard focus stays inside and returns on close');
}).catch(e=>{console.error(e);process.exitCode=1;});

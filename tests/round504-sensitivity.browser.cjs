const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick,c})=>{
 await pick([require('./scene504-fixture.cjs')()]);await p.locator('#sceneNav504>summary').click();await p.locator('#snScan504').click();await p.waitForFunction(()=>!document.querySelector('#snScan504').disabled);
 const count=await p.locator('#snScenes504 li').count();assert.equal(count,2);
 await c.setOffline(true);await p.locator('#snSensitivity504').selectOption('0.08');assert.equal(await p.locator('#snScenes504 li').count(),3);await p.locator('#snScenes504 button').nth(1).click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-4)<.1);
 await p.locator('#snSensitivity504').selectOption('0.32');assert.equal(await p.locator('#snScenes504 li').count(),1);assert.match(await p.locator('#snStatus504').textContent(),/No large/);assert.equal(await p.locator('#snCancel504').isHidden(),true);
 // Changing sensitivity and language never starts a new decoder. It uses cached samples only.
 await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#snSensitivity504 option:checked').textContent==='सिर्फ़ बड़े बदलाव');assert.match(await p.locator('#snStatus504').textContent(),/बदलाव/);
 await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#snSensitivity504 option:checked').textContent==='માત્ર મોટા ફેરફાર');await c.setOffline(false);
 console.log('PASS actual colour changes; adjustable sensitivity from cached scan offline, translated options and no new scan');
}).catch(e=>{console.error(e);process.exitCode=1;});

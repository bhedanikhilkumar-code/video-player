const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p,c,boot,open,pref,origin})=>{
 await open();const before=await pref();await p.locator('#tlPal538').selectOption('sunset');assert.deepEqual(await pref(),before,'staging does not persist');
 await p.locator('#tlTry538').click();assert.equal(await p.locator('html').getAttribute('data-palette'),'sunset');assert.deepEqual(await pref(),before,'trial does not enter prefs');assert.equal(await p.locator('#tlKeep538').isVisible(),true);
 await p.locator('#langBtn').click();assert.equal((await pref()).palette534,before.palette534,'an unrelated language save cannot commit trial colours');await p.locator('#langBtn').click();await p.locator('#langBtn').click();assert.equal(await p.locator('html').getAttribute('lang'),'en');assert.equal(await p.locator('html').getAttribute('data-palette'),'sunset','trial survives relabel');
 await p.locator('#tlRevert538').click();assert.equal(await p.locator('html').getAttribute('data-palette'),null);assert.deepEqual(await pref(),before);
 await p.locator('#tlTry538').click();await p.keyboard.press('Escape');assert.equal(await p.locator('#tlTrial538').isVisible(),false);assert.deepEqual(await pref(),before);
 await p.locator('#tlTry538').click();await p.locator('#tlKeep538').click();assert.equal((await pref()).palette534,'sunset');assert.equal((await pref()).theme,'dark');
 await boot();await open();assert.equal(await p.locator('html').getAttribute('data-palette'),'sunset');assert.equal(await p.locator('#tlPal538').inputValue(),'sunset');await boot();await open();assert.equal((await pref()).palette534,'sunset');
 await p.locator('#tlPal538').selectOption('mint');await p.locator('#tlTry538').click();await p.locator('[data-pal="ocean"]').click();assert.equal((await pref()).palette534,'ocean');assert.equal(await p.locator('html').getAttribute('data-palette'),'ocean');assert.equal(await p.locator('#tlTrial538').isVisible(),false,'external change ends trial without stomping new choice');
 await p.locator('#tlPal538').selectOption('forest');await p.locator('#tlTry538').click();await c.setOffline(true);await p.locator('#tlRevert538').click();assert.equal(await p.locator('html').getAttribute('data-palette'),'ocean');await c.setOffline(false);
 // Use the real deadline, not a stubbed callback, to prove automatic reversion.
 await p.locator('#tlTry538').click();await p.waitForFunction(()=>document.querySelector('#tlTrial538').hidden,{},{timeout:23000});assert.equal(await p.locator('html').getAttribute('data-palette'),'ocean');assert.equal((await pref()).palette534,'ocean');
 console.log('PASS theme fitting room: '+origin+'; staging/trial not saved, revert/Escape, explicit Keep, two fresh loads, external change, offline, real 20-second deadline');
}).catch(e=>{console.error(e);process.exitCode=1;});

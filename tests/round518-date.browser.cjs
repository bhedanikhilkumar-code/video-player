const assert=require('node:assert/strict');
require('./round518-harness.cjs')(async({p,open,rows,boot,origin})=>{
 await open();const dates=await p.evaluate(()=>{const val=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');return [3,31,-1].map(n=>{const d=new Date();d.setDate(d.getDate()+n);return val(d);});});
 await p.locator('#remDate518').fill(dates[0]);await p.locator('#remTime517').fill('18:30');await p.locator('#remVid517').selectOption('9bZkp7q19f0');await p.locator('#remSet517').click();const saved=await rows();assert.equal(saved.length,1);assert.equal(saved[0].id,'9bZkp7q19f0');const at=new Date(saved[0].at);assert.equal(at.getHours(),18);assert.equal(at.getMinutes(),30);assert.ok(saved[0].at>Date.now()+2*864e5);
 for(const bad of [dates[1],dates[2]]){await p.locator('#remDate518').fill(bad);await p.locator('#remSet517').click();assert.deepEqual(await rows(),saved);assert.match(await p.locator('#remMsg517').textContent(),/future date/i);}
 await boot();await open();assert.deepEqual(await rows(),saved);assert.match(await p.locator('#remList517').textContent(),/Second saved video/);await boot();assert.deepEqual(await rows(),saved);
 await open();await p.locator('#remDate518').fill('');await p.locator('#remTime517').fill('23:58');await p.locator('#remSet517').click();assert.equal((await rows()).length,2,'blank date keeps next-clock-time behavior');
 await p.locator('#langBtn').click();await p.waitForTimeout(2000);assert.ok(!/Schedule a watch date|Watch date \(optional\)|Times use/.test(await p.locator('#remindCard517').textContent()));await p.locator('#langBtn').click();await p.waitForTimeout(2000);assert.ok(!/Schedule a watch date|Watch date \(optional\)|Times use/.test(await p.locator('#remindCard517').textContent()));
 await p.setViewportSize({width:390,height:844});await p.locator('#remDateTitle518').scrollIntoViewIfNeeded();await p.screenshot({path:'/downloads/r518-date-gu-local.png'});
 console.log('PASS date scheduling, bounds, persistence, blank-date fallback, HI/GU '+origin);
}).catch(e=>{console.error(e);process.exitCode=1;});

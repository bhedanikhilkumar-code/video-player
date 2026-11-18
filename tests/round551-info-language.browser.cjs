const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.locator('#lpFile').setInputFiles(require('./round548-video-fixture.cjs')());await p.waitForFunction(()=>Number.isFinite(document.querySelector('#lpVideo').duration));await p.locator('#lpInfoBtn278').click();assert.equal(await p.locator('#lpInfo278').evaluate(e=>e.hidden),false);assert.match(await p.locator('#lpInfo278').textContent(),/^Name: Quiet-map demo.mp4/m);
 const src=await p.locator('#lpVideo').getAttribute('src');
 for(const lang of ['hi','gu','en']){await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l&&document.querySelector('#langBtn').getAttribute('aria-busy')==='false',lang);const info=await p.locator('#lpInfo278').textContent();assert.match(info,new RegExp('^'+(lang==='hi'?'नाम':lang==='gu'?'નામ':'Name')+': Quiet-map demo.mp4','m'),'open file details must repaint without closing/reopening');assert.match(info,/640 × 360 px/);assert.equal(await p.locator('#lpVideo').getAttribute('src'),src);assert.equal(await p.locator('#lpInfo278').evaluate(e=>e.hidden),false);}
 assert.deepEqual(errors,[]);console.log('PASS open File info follows EN/HI/GU/EN immediately, real metadata preserved, no player source change or panel toggle');
}).catch(e=>{console.error(e);process.exitCode=1;});

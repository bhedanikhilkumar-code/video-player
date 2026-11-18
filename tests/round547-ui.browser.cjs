const assert=require('node:assert/strict'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,boot,errors})=>{
 await p.evaluate(()=>{const create=VPPeakSoftener547.create;VPPeakSoftener547.create=(...args)=>window.__testPeak547=create(...args);});
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.play());
 await p.locator('#peakSoftener547 summary').click();
 assert.equal(await p.evaluate(()=>__testPeak547.mode()),'off');
 for(const mode of ['gentle','strong','off']){await p.locator('[data-peak547="'+mode+'"]').click();assert.equal(await p.evaluate(()=>__testPeak547.mode()),mode);assert.equal(await p.locator('[data-peak547="'+mode+'"]').getAttribute('aria-pressed'),'true');assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-lp.v1')).peak547),mode);}
 await p.locator('[data-peak547="strong"]').click();await boot();assert.equal(await p.locator('[data-peak547="strong"]').getAttribute('aria-pressed'),'true');await boot();assert.equal(await p.locator('[data-peak547="strong"]').getAttribute('aria-pressed'),'true');
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpSndResetBtn309').click();assert.equal(await p.locator('[data-peak547="off"]').getAttribute('aria-pressed'),'true');
 await p.setViewportSize({width:390,height:844});await p.locator('#peakSoftener547 summary').click();assert.equal(await p.locator('#peakSoftener547').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
 assert.deepEqual(errors,[]);console.log('PASS peak UI: graph mode, each control, saved preference, two fresh loads, sound reset, 390px width');
}).catch(e=>{console.error(e);process.exitCode=1;});

const assert=require('node:assert/strict'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,c,boot,origin})=>{
 await p.evaluate(()=>{const create=VPPeakSoftener547.create;VPPeakSoftener547.create=(...a)=>window.__peerPeak547=create(...a);});
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.play());await p.locator('#peakSoftener547 summary').click();
 const peer=await c.newPage();await peer.goto(origin);await peer.waitForFunction(()=>window.__vpMainOk325);await peer.locator('#lpFile').setInputFiles(fixture);await peer.locator('#peakSoftener547 summary').click();await peer.locator('[data-peak547="strong"]').click();
 await p.waitForFunction(()=>document.querySelector('[data-peak547="strong"]').getAttribute('aria-pressed')==='true');assert.equal(await p.evaluate(()=>__peerPeak547.mode()),'strong');
 await p.locator('[data-peak547="gentle"]').click();await peer.waitForFunction(()=>document.querySelector('[data-peak547="gentle"]').getAttribute('aria-pressed')==='true');
 await peer.evaluate(()=>localStorage.removeItem('vp-lp.v1'));await p.waitForFunction(()=>document.querySelector('[data-peak547="off"]').getAttribute('aria-pressed')==='true');assert.equal(await p.evaluate(()=>__peerPeak547.mode()),'off');
 await peer.evaluate(()=>localStorage.setItem('vp-lp.v1','{broken'));assert.equal(await p.locator('[data-peak547="off"]').getAttribute('aria-pressed'),'true');await peer.close();
 console.log('PASS peak peer-tab changes update the live graph and controls; removal restores off; malformed data is ignored');
}).catch(e=>{console.error(e);process.exitCode=1;});

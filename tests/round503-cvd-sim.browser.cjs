const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=503s');await p.waitForFunction(()=>window.__vpMainOk325&&!document.getElementById('controls').hidden);
 assert.equal(await p.locator('#cvdSim503').isHidden(),true);
 await p.locator('#cvdChips503 .chip[data-k="pro"]').click();
 const corr=await p.evaluate(()=>document.getElementById('vpCvdM503').getAttribute('values'));
 await p.locator('#cvdSim503').click();
 const sim=await p.evaluate(()=>({m:document.getElementById('vpCvdM503').getAttribute('values'),k:localStorage.getItem('vp-cvd.v1')}));
 assert.equal(sim.k,'pro-2-sim');assert.notEqual(sim.m,corr);
 // simulated red-weak: pure red loses most of its red and gains green
 const n=sim.m.split(' ').map(Number);assert.ok(n[0]<1&&n[5]>0);
 await p.locator('#cvdStr503 .chip[data-s="3"]').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-cvd.v1')),'pro-3-sim');
 await p.locator('#cvdSim503').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-cvd.v1')),'pro-3');
});

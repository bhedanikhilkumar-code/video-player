const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,errors,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=503');await p.waitForFunction(()=>window.__vpMainOk325&&!document.getElementById('controls').hidden);
 assert.equal(await p.locator('#cvdChips503 .chip').count(),4);
 assert.equal(await p.locator('#cvdStr503').isHidden(),true);
 await p.locator('#cvdChips503 .chip[data-k="deu"]').click();
 const st=await p.evaluate(()=>({k:localStorage.getItem('vp-cvd.v1'),v:document.documentElement.style.getPropertyValue('--vp-cvd'),f:getComputedStyle(document.querySelector('#lpVideo')).filter,m:document.getElementById('vpCvdM503').getAttribute('values')}));
 assert.equal(st.k,'deu-2');assert.match(st.v,/vpCvd503/);assert.match(st.f,/url/);
 const nums=st.m.split(' ').map(Number);assert.equal(nums.length,20);
 // rows sum to 1 for each colour row so white and grey stay neutral
 for(const r of [0,5,10]){assert.ok(Math.abs(nums[r]+nums[r+1]+nums[r+2]-1)<2e-3,'row '+r);}
 await p.locator('#cvdStr503 .chip[data-s="3"]').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-cvd.v1')),'deu-3');
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await pick(files.slice(0,1));assert.match(await p.evaluate(()=>getComputedStyle(document.querySelector('#lpVideo')).filter),/url/);
 assert.equal(await p.evaluate(()=>document.documentElement.style.getPropertyValue('--vp-cvd')),'url(#vpCvd503)');
 await p.evaluate(()=>document.querySelector('#cvdChips503 .chip[data-k="off"]').click());
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-cvd.v1')),null);
});

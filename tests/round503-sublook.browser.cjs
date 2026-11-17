const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.goto(origin+'/?v=dQw4w9WgXcQ&cb=503t');await p.waitForFunction(()=>window.__vpMainOk325&&!document.getElementById('controls').hidden);
 await p.locator('#subLookCol503 .chip[data-v="y"]').click();
 await p.locator('#subLookBg503 .chip[data-v="solid"]').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-sublook.v1')),'y-solid');
 const cs=await p.evaluate(()=>{const o=document.getElementById('subOv314');const x=getComputedStyle(o);return[x.color,x.backgroundColor]});
 assert.equal(cs[0],'rgb(255, 230, 0)');assert.equal(cs[1],'rgb(0, 0, 0)');
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);
 assert.equal(await p.evaluate(()=>document.documentElement.style.getPropertyValue('--vp-subcol')),'#ffe600');
 assert.equal(await p.locator('#subLookCol503 .chip.active').getAttribute('data-v'),'y');
 await p.locator('#subLookCol503 .chip[data-v="w"]').click();await p.locator('#subLookBg503 .chip[data-v="glass"]').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('vp-sublook.v1')),null);
 // high contrast keeps a black backing
 await p.evaluate(()=>document.documentElement.classList.add('high-contrast'));
 await p.locator('#subLookBg503 .chip[data-v="clear"]').click();
 assert.equal(await p.evaluate(()=>getComputedStyle(document.getElementById('subOv314')).backgroundColor),'rgb(0, 0, 0)');
});

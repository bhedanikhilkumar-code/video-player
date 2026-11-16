const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{await pick(files.slice(0,1));
 await p.evaluate(async()=>{for(const [w,h,colour] of [[200,400,'#0000ff'],[640,360,'#ff0000']]){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=colour;x.fillRect(0,0,w,h);await window.__vpFrameGalAdd(await new Promise(r=>c.toBlob(r)),w,h);}});
 await p.waitForFunction(()=>document.querySelectorAll('#lpGalGrid285>button').length===2);
 await p.locator('#lpGal285>summary').click();await p.locator('#galCompare492>summary').click();await p.locator('#galCompareA492').selectOption({index:0});await p.locator('#galCompareB492').selectOption({index:1});await p.locator('#galCompareLoad492').click();await p.waitForFunction(()=>!document.querySelector('#galCompareSave492').disabled);
 const pixel=await p.locator('#galCompareCanvas492').evaluate(c=>[...c.getContext('2d').getImageData(1100,300,1,1).data]);assert.deepEqual(pixel,[9,13,22,255],'second frame letterbox must not leak pixels from first frame');
 await p.locator('#galCompareRange492').fill('0');const pixel2=await p.locator('#galCompareCanvas492').evaluate(c=>[...c.getContext('2d').getImageData(50,300,1,1).data]);assert.deepEqual(pixel2,[9,13,22,255]);console.log('PASS different-aspect wipe preserves second frame letterbox');
}).catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict'),fs=require('fs');
require('./round445-harness.cjs')(async({p,pick})=>{
 await p.setViewportSize({width:390,height:844});
 await pick([require('./scene504-fixture.cjs')()]);
 await p.locator('#sceneNav504>summary').click();await p.locator('#snScan504').click();await p.waitForFunction(()=>!document.querySelector('#snScan504').disabled);
 await p.locator('#sceneNav504').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#lpViewWrap').classList.contains('lpMini447'));
 await p.screenshot({path:'/downloads/scene504-local-en.png'});
 for(const [lang,text]of [['hi','दृश्य बदलाव नेविगेटर'],['gu','દૃશ્ય બદલાવ નેવિગેટર']]){
  await p.locator('#langBtn').click();await p.waitForFunction(t=>document.querySelector('#sceneNav504>summary').textContent===t,text);
  await p.locator('#sceneNav504').scrollIntoViewIfNeeded();await p.screenshot({path:'/downloads/scene504-local-'+lang+'.png'});
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 await p.evaluate(()=>{document.documentElement.classList.add('high-contrast','low-fx','calm-motion');document.documentElement.dataset.theme='dark';});
 await p.screenshot({path:'/downloads/scene504-local-contrast.png'});
 console.log('PASS mobile English Hindi Gujarati; video dock visible; no horizontal overflow; contrast low-end calm screenshot');
}).catch(e=>{console.error(e);process.exitCode=1;});

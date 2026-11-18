const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 for(const lang of ['en','hi','gu']){
  if(lang!=='en'){await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l&&document.querySelector('#langBtn').getAttribute('aria-busy')==='false',lang);}
  await p.locator('#palBtn').click();await p.locator('#vpPal input').fill('Quiet-section navigator');await p.locator('#vpPal [role=option]').first().click();await p.waitForFunction(()=>document.querySelector('#vpToast').textContent.includes(T('Load one of your own video or audio files first - this one works on device files.')));
 }
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#palBtn').click();await p.locator('#vpPal input').fill('Quiet-section navigator');await p.locator('#vpPal [role=option]').first().click();assert.equal(await p.locator('#quietMap548').evaluate(e=>e.open),true);
 await p.waitForFunction(()=>document.querySelector('#whatsNewList .wnew-name')?.textContent===T('Listening cut list'),{},{timeout:22000});assert.equal(await p.locator('#whatsNewList > li').count(),10);
 console.log('PASS new discovery: no-file guidance en/hi/gu, loaded finder opens navigator, latest Listening cut list is translated and What is new capped at 10');assert.deepEqual(errors,[]);
}).catch(e=>{console.error(e);process.exitCode=1;});

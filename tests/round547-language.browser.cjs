const assert=require('node:assert/strict'),fs=require('node:fs'),fixture=require('./round543-fixture.cjs')();
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.setViewportSize({width:390,height:844});await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#peakSoftener547 summary').click();
 for(const [lang,title] of [['hi','तेज़ ध्वनि नरम करें'],['gu','તીવ્ર અવાજ નરમ કરો'],['en','Peak softener']]){
  await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l,lang);
  await p.waitForFunction(t=>document.querySelector('#peakTitle547').textContent===t,title);
  assert.equal(await p.locator('#peakTitle547').textContent(),title);
  assert.equal(await p.locator('#peakSoftener547').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
  await p.locator('[data-peak547="strong"]').click();assert.equal(await p.locator('[data-peak547="strong"]').getAttribute('aria-pressed'),'true');
  await p.locator('#peakSoftener547').scrollIntoViewIfNeeded();await p.screenshot({path:'/downloads/peak547-'+lang+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS peak localization: en/hi/gu reactive labels, selection and mobile width; screenshots saved');
}).catch(e=>{console.error(e);process.exitCode=1;});

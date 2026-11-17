const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 await p.evaluate(()=>localStorage.setItem('vp-library.v1',JSON.stringify({favs:[{id:'dQw4w9WgXcQ',title:'Rick Astley music'}],later:[{id:'9bZkp7q19f0',title:'PSY music'}],queue:[{id:'dQw4w9WgXcQ',title:'Rick Astley music'}],hist:[{id:'LXb3EKWsInQ',title:'Costa Rica music'}]})));
 await boot();
 assert.equal(await p.evaluate(()=>window.__vpPalVideos508('music').length),3);
 assert.equal(await p.evaluate(()=>window.__vpPalVideos508('').length),0);
 await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('Rick');
 await p.waitForFunction(()=>document.querySelector('#vpPalItem0').textContent.includes('Rick'));
 assert.equal(await p.locator('#vpPalItem0 .vp-pal-pin').count(),0);
 await p.locator('#vpPalIn').press('Enter');
 await p.waitForFunction(()=>document.querySelector('iframe[src*="/embed/dQw4w9WgXcQ"]'));
 assert.equal(await p.locator('#vpPal').count(),0);
 assert.ok(!(await p.evaluate(()=>localStorage.getItem('vp-pal-recent.v1')||'')).includes('Rick'));
 for(const [lang,name] of [['en','Your videos'],['hi','आपके वीडियो'],['gu','તમારા વીડિયો']]){
  await p.evaluate(l=>{let x=JSON.parse(localStorage.getItem('vp-prefs.v1'));x.lang=l;localStorage.setItem('vp-prefs.v1',JSON.stringify(x));},lang);
  await boot();await p.setViewportSize({width:390,height:844});
  await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('music');
  await p.waitForFunction(n=>document.querySelector('#vpPalList .vp-pal-grp').textContent===n,name);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.screenshot({path:'/downloads/r508-search-'+lang+'.png'});
  await p.locator('#vpPalIn').press('Escape');
 }
 console.log('PASS search library: dedupe, lists, keyboard play, no rec/pin, languages at 390px, reload');
}).catch(e=>{console.error(e);process.exitCode=1;});

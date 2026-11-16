const assert=require('node:assert/strict'),languageTap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,c,boot})=>{
 await c.addInitScript(()=>{if(localStorage.getItem('sb487-test'))return;localStorage.setItem('sb487-test','1');localStorage.setItem('vp-library.v1',JSON.stringify({hist:[],favs:[{id:'dQw4w9WgXcQ',title:'Rick Astley - Never Gonna Give You Up'},{id:'9bZkp7q19f0',title:'PSY - GANGNAM STYLE'},{id:'aqz-KE-bpKQ',title:'Rick movie trailer'}],queue:[],later:[]}));localStorage.setItem('vp-notes.v1',JSON.stringify({dQw4w9WgXcQ:'Remember this song'}));});
 await boot();await p.locator('#searchBuilder487 summary').click();
 await p.locator('#sbWords487').fill('Rick');await p.locator('#sbOmit487').fill('trailer');await p.locator('#sbList487').selectOption('is:fav');await p.locator('#sbNote487').check();
 assert.equal(await p.locator('#libSearch').inputValue(),'','editing rules does not change active search');
 assert.equal(await p.locator('#sbQuery487').textContent(),'"Rick" -"trailer" is:fav has:note');
 assert.equal(await p.locator('#searchBuilder487 [role=status]').textContent(),'Saved-video matches: 1');
 assert.equal(await p.locator('.sb-preview487 li').count(),1);await p.locator('#sbApply487').click();
 assert.equal(await p.locator('#libSearch').inputValue(),'"Rick" -"trailer" is:fav has:note');
 assert.ok(await p.locator('#libSearchMsg').textContent().then(x=>x.includes('Showing')));
 await p.locator('#sbReset487').click();assert.equal(await p.locator('#sbQuery487').textContent(),'Any saved list');
 assert.notEqual(await p.locator('#libSearch').inputValue(),'','builder reset leaves applied search alone');
 await p.locator('#sbPhrase487').fill('is:fav "quoted"');assert.equal(await p.locator('#searchBuilder487 [role=status]').textContent(),'Saved-video matches: 0','operator-like user text stays literal');
 await p.locator('#sbReset487').click();await p.locator('#sbWords487').fill('Rick');
 await p.setViewportSize({width:390,height:844});
 for(const lang of ['en','hi','gu']){
  for(let i=0;i<3&&await p.locator('html').getAttribute('lang')!==lang;i++)await languageTap(p);
  await p.locator('#searchBuilder487').scrollIntoViewIfNeeded();
  assert.ok(await p.locator('#searchBuilder487').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'no horizontal overflow '+lang);
  assert.equal(await p.locator('#sbWords487').inputValue(),'Rick','translation preserves form draft');
  if(lang!=='en')assert.notEqual(await p.locator('#searchBuilder487 summary').textContent(),'Library search builder');
  await p.screenshot({path:'/downloads/round487-builder-'+lang+'.png'});
 }
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx','spoiler285');});
 assert.equal(await p.locator('.sb-preview487').isVisible(),false,'spoiler-free preview does not expose titles');
 await p.locator('#sbApply487').click();
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#sbWords487').inputValue(),'','draft intentionally resets on reload');
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#searchBuilder487').count(),1);
 console.log('PASS search builder: preview, apply, literal text safety, independent reset, reload twice, spoiler-free, 390px English/Hindi/Gujarati');
}).catch(e=>{console.error(e);process.exitCode=1;});

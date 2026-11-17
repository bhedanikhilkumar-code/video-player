const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot,pick})=>{
 await p.evaluate(()=>localStorage.setItem('vp-library.v1',JSON.stringify({favs:[{id:'dQw4w9WgXcQ',title:'Rick Astley - Never Gonna Give You Up'}],queue:[],later:[{id:'9bZkp7q19f0',title:'PSY - Gangnam Style'}],hist:[]})));
 await boot();await pick();
 await p.locator('#lpVideo').scrollIntoViewIfNeeded();await p.waitForTimeout(400);
 // Scroll to header so the actual device video docks before opening Search.
 await p.locator('#palBtn').scrollIntoViewIfNeeded();await p.waitForTimeout(600);
 await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('Rick');
 assert.ok(await p.evaluate(()=>document.querySelector('#lpVideo').readyState>=2));
 await p.screenshot({path:'/downloads/r508-live-desktop.png'});
 await p.locator('#vpPalIn').press('Escape');
 for(const lang of ['hi','gu']){
  const expected=lang==='hi'?'hi':'gu';
  await p.locator('#langBtn').click();await p.waitForFunction(l=>document.documentElement.lang===l,expected);await p.waitForTimeout(2800);
  await p.setViewportSize({width:390,height:844});
  await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('Rick');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.screenshot({path:'/downloads/r508-live-'+lang+'.png'});
  await p.locator('#vpPalIn').press('Escape');
 }
 // Existing visual preference classes must not hide the palette or its readable text.
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','low-fx','calm-motion');});
 await p.locator('#palBtn').click();await p.locator('#vpPalIn').fill('Rick');
 assert.ok(await p.locator('#vpPalItem0').isVisible());
 await p.screenshot({path:'/downloads/r508-live-contrast.png'});
 await p.locator('#vpPalIn').press('Escape');
 console.log('PASS LIVE visual workflow: device playback, docked search, Hindi/Gujarati 390px, dark/high contrast/low effects');
}).catch(e=>{console.error(e);process.exitCode=1;});

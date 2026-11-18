const assert=require('node:assert/strict');
const media=process.env.VP_VISUAL_MEDIA;
if(!media)throw Error('Set VP_VISUAL_MEDIA to a local video fixture with audio.');
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.setViewportSize({width:390,height:1080});await p.locator('#lpFile').setInputFiles(media);await p.locator('#lpVideo').evaluate(v=>{v.loop=true;return v.play();});
 await p.locator('#peakSoftener547 summary').click();await p.locator('[data-peak547="strong"]').click();await p.waitForFunction(()=>document.querySelector('#peakMeter547').value>0);
 async function capture(id,name){await p.locator(id).evaluate(e=>e.scrollIntoView({block:"start",behavior:"instant"}));await p.waitForTimeout(900);assert.equal(await p.locator(id).evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);await p.screenshot({path:'/downloads/'+name+'.png'});}
 await capture('#peakSoftener547','round547-peak-en');
 await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#peakTitle547').textContent==='तेज़ ध्वनि नरम करें');await p.locator('#soundCompare547 summary').click();await p.locator('#soundCompareButton547').click();await capture('#soundCompare547','round547-compare-hi');
 await p.locator('#soundCompareButton547').click();await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#peakTitle547').textContent==='તીવ્ર અવાજ નરમ કરો');
 await p.locator('#themeBtn').click();await p.locator('#themeBtn').click();await p.locator('#themeBtn').click();await p.waitForFunction(()=>document.documentElement.dataset.theme==='dark');await capture('#peakSoftener547','round547-peak-gu-dark');
 if(await p.locator('#help').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#help .sec-toggle').click();await p.locator('#a11yHc').check();await p.locator('#a11yLow').check();await p.locator('#a11yCalm').check();
 await p.locator('#soundCompareButton547').click();await capture('#soundCompare547','round547-compare-gu-accessible');assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('high-contrast')&&e.classList.contains('low-fx')&&e.classList.contains('calm-motion')),true);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>!v.paused),true);assert.deepEqual(errors,[]);console.log('PASS real-video mobile visual flows: en/hi/gu, peak meter, original comparison, dark, High contrast, Calm, Low-end, docked video');
}).catch(e=>{console.error(e);process.exitCode=1;});

const languageTap = require('./language-tap.cjs');
// Run with Playwright and local Chrome: node tests/round419.browser.cjs
const { chromium } = require('playwright');
const fs = require('fs'), http = require('http'), assert = require('node:assert/strict'), path = require('path');
const root = path.resolve(__dirname, '..');
const server = http.createServer((q, r) => {
  const file = path.join(root, new URL(q.url, 'http://local').pathname.replace(/^\//, '') || 'index.html');
  try { r.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'application/javascript' : 'application/octet-stream'); r.end(fs.readFileSync(file)); }
  catch { r.statusCode = 404; r.end(); }
});
(async () => {
  await new Promise(r => server.listen(8499, r));
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext(); const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    const good={key:'portable',video:'dQw4w9WgXcQ',name:'Guitar routine',steps:[{name:'Warmup',a:5,b:10,passes:2},{name:'Chorus',a:20,b:30,passes:3}]};
    const file=(circuits)=>({name:'circuits.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'vp-circuits',version:1,circuits}))});
    const open=async()=>{await page.locator('#linkInput').fill('dQw4w9WgXcQ');await page.locator('#loadBtn').click();await page.locator('#circuit421').evaluate(e=>e.open=true);await page.locator('#circuitExchange422').evaluate(e=>e.open=true);};
    await open();
    await page.locator('#ceFile422').setInputFiles(file([good]));await page.waitForFunction(()=>document.querySelector('#cePreview422 strong'));
    assert.match(await page.locator('#cePreview422').textContent(),/Guitar routine/);assert.match(await page.locator('#cePreview422').textContent(),/0:20 - 0:30 × 3/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('vp-circuit-presets421.v1')),null);
    await page.locator('#ceCancel422').click();assert.equal(await page.locator('#cePreview422 strong').count(),0);assert.equal(await page.locator('#ceAdd422').isDisabled(),true);
    await page.locator('#ceFile422').setInputFiles(file([{...good,steps:[{name:'broken',a:10,b:5,passes:1}]}]));await page.waitForFunction(()=>document.querySelector('#ceStatus422').textContent.includes('not a valid'));assert.equal(await page.locator('#ceAdd422').isDisabled(),true);
    await page.locator('#ceFile422').setInputFiles(file([good]));await page.waitForFunction(()=>!document.querySelector('#ceAdd422').disabled);await page.locator('#ceAdd422').click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-circuit-presets421.v1')).length),1);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.locator('#vpToast button').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-circuit-presets421.v1')).length),0);
    await page.locator('#ceFile422').setInputFiles(file([good]));await page.waitForFunction(()=>!document.querySelector('#ceAdd422').disabled);await page.locator('#ceAdd422').click();
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await open();assert.equal(await page.locator('#ceExport422').isDisabled(),false);
    await page.locator('#ceFile422').setInputFiles(file([good]));await page.waitForFunction(()=>document.querySelector('#cePreview422 strong'));assert.equal(await page.locator('#ceAdd422').isDisabled(),true);assert.match(await page.locator('#cePreview422').textContent(),/Already saved/);
    const download=page.waitForEvent('download');await page.locator('#ceExport422').click();const out=await download;const exported=JSON.parse(fs.readFileSync(await out.path(),'utf8'));assert.equal(exported.format,'vp-circuits');assert.equal(exported.circuits.length,1);assert.deepEqual(exported.circuits[0].steps,good.steps);assert.deepEqual(Object.keys(exported).sort(),['circuits','format','version']);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await open();
    // Two identical keys/names in one file must reject the whole import, not silently drop one.
    await page.locator('#ceFile422').setInputFiles(file([good,good]));await page.waitForFunction(()=>document.querySelector('#ceStatus422').textContent.includes('not a valid'));assert.equal(await page.locator('#ceAdd422').isDisabled(),true);
    await page.locator('#ceFile422').setInputFiles(file([{...good,key:'other',name:'Finger drill'}]));await page.waitForFunction(()=>!document.querySelector('#ceAdd422').disabled);
    for(const lang of ['en','hi','gu']){for(let i=0;i<3&&await page.locator('html').getAttribute('lang')!==lang;i++)await languageTap(page);await page.setViewportSize({width:390,height:844});await page.locator('#circuitExchange422').screenshot({path:'/downloads/422-exchange-'+lang+'.png'});if(lang!=='en')assert.notEqual(await page.locator('#circuitExchange422 > summary').textContent(),'Circuit exchange');}
    assert.deepEqual(errors,[]);console.log('Circuit exchange: file preview, cancel, malformed/duplicate rejection, safe merge, Undo, fresh/repeat loads, export round-trip and 390px languages pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

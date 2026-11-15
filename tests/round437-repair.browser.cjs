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
    page.on('pageerror', e => {errors.push(e.message);console.error('PAGE',e.stack);});
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    const samples=8000*12, wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
    const key='vp-offline-sessions435.v1';
    const shelf=page.locator('#offlineShelf432');await shelf.locator('> summary').click();
    await page.locator('#offlineFiles432').setInputFiles([{name:'Warmup.wav',mimeType:'audio/wav',buffer:wav},{name:'Practice.wav',mimeType:'audio/wav',buffer:wav}]);
    await page.waitForFunction(()=>document.querySelectorAll('.offline-choose435').length===2);
    await page.locator('#offlineSessionAll435').click();await page.locator('#offlineSaved435 > summary').click();
    await page.locator('#offlineSavedName435').fill('Morning session');await page.locator('#offlineSavedSave435').click();
    const original=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    const currentDraft=await page.locator('#offlineSessionRows435').textContent();
    // A fresh device has a different copy. The UI requires an explicit mapping.
    await page.locator('#offlineFiles432').setInputFiles({name:'Replacement.wav',mimeType:'audio/wav',buffer:wav});await page.waitForFunction(()=>document.querySelectorAll('.offline-choose435').length===3);
    const ids=await page.locator('#offlineRows432 article').evaluateAll(rows=>rows.map(r=>({name:r.querySelector('strong').textContent,id:JSON.stringify([r.querySelector('strong').textContent,192044,0])})));
    await page.locator('.offline-saved-repair437435').click();
    await page.locator('#offlineRepairReview437').click();assert.match(await page.locator('#offlineRepairStatus437').textContent(),/At least one/);
    const choices=await page.locator('#offlineRepairPick437-0 option').evaluateAll(opts=>opts.map(x=>({label:x.textContent,value:x.value})));
    const replacement=choices.find(x=>x.label.startsWith('Replacement.wav')).value;
    await page.locator('#offlineRepairPick437-0').selectOption(replacement);await page.locator('#offlineRepairPick437-1').selectOption(replacement);await page.locator('#offlineRepairReview437').click();assert.match(await page.locator('#offlineRepairStatus437').textContent(),/different shelf/);
    await page.locator('#offlineRepairPick437-1').selectOption(original[0].files[1].id);await page.locator('#offlineRepairReview437').click();
    assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),original);assert.match(await page.locator('#offlineRepairRows437').textContent(),/Replacement.wav/);
    await page.locator('#offlineRepairBack437').click();assert.equal(await page.locator('#offlineRepairPick437-0').inputValue(),replacement);
    await page.locator('#offlineRepairReview437').click();
    // Storage failure leaves the choices, session and playback intact.
    await page.evaluate(k=>{window.originalSet437=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===k)throw new DOMException('full','QuotaExceededError');return window.originalSet437.call(this,key,value);};},key);
    await page.locator('#offlineRepairSave437').click();await page.waitForFunction(()=>!document.querySelector('#offlineRepairSave437').disabled);assert.match(await page.locator('#offlineRepairStatus437').textContent(),/could not/);assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),original);
    await page.evaluate(()=>Storage.prototype.setItem=window.originalSet437);
    // Preview persists through language reflow and both 390px themes.
    await page.setViewportSize({width:390,height:844});
    for(const lang of ['hi','gu','en']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await page.locator('#langBtn').click();assert.ok(await page.locator('#offlineRepair437').evaluate(e=>e.scrollWidth<=e.clientWidth+1));assert.equal(await page.locator('#offlineRepairSave437').isVisible(),true);}
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx');});
    await page.locator('#offlineRepair437').scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/437-repair-local.png'});
    await page.locator('#offlineRepairSave437').click();await page.locator('#offlineRepair437').waitFor({state:'hidden'});
    const repaired=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(repaired[0].files[0].id,replacement);assert.equal(repaired[0].files[1].id,original[0].files[1].id);assert.equal(await page.locator('#offlineSessionRows435').textContent(),currentDraft);assert.equal(await page.locator('#lpVideo').getAttribute('src'),null);
    for(let i=0;i<2;i++){await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await shelf.evaluate(e=>e.open=true);await page.locator('#offlineSaved435').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===3);assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),repaired);}
    // Concurrent changes are preserved, not overwritten by a stale editor.
    await page.locator('.offline-saved-repair437435').click();await page.locator('#offlineRepairPick437-0').selectOption(original[0].files[0].id);await page.locator('#offlineRepairReview437').click();
    await page.evaluate(k=>{const rows=JSON.parse(localStorage.getItem(k));rows[0].name='Changed elsewhere';localStorage.setItem(k,JSON.stringify(rows));},key);await page.locator('#offlineRepairSave437').click();await page.waitForFunction(()=>!document.querySelector('#offlineRepairSave437').disabled);assert.match(await page.locator('#offlineRepairStatus437').textContent(),/another tab/);assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k))[0].name,key),'Changed elsewhere');
    await page.locator('#offlineRepairCancel437').click();assert.equal(await page.locator('#offlineRepair437').isVisible(),false);
    assert.deepEqual(errors,[]);console.log('Repair saved offline session: explicit unique mapping, review/back/cancel, quota failures, durable two-load save, untouched draft/player, stale-edit guard and EN/HI/GU 390px pass');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

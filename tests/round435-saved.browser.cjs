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
    await page.locator('#offlineShelf432 > summary').click();
    await page.locator('#offlineFiles432').setInputFiles([{name:'Warmup.wav',mimeType:'audio/wav',buffer:wav},{name:'Practice.wav',mimeType:'audio/wav',buffer:wav}]);
    await page.waitForFunction(()=>document.querySelectorAll('.offline-choose435').length===2);
    await page.locator('#offlineSessionAll435').click();await page.locator('#offlineSaved435 > summary').click();
    const count=()=>page.locator('#offlineSavedRows435 article').count();
    await page.locator('#offlineSavedName435').fill('Morning practice');await page.locator('#offlineSavedSave435').click();assert.equal(await count(),1);assert.match(await page.locator('#offlineSavedStatus435').textContent(),/saved/);
    const expected=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    await page.locator('#offlineSavedName435').fill('MORNING PRACTICE');await page.locator('#offlineSavedSave435').click();assert.equal(await count(),1);assert.match(await page.locator('#offlineSavedStatus435').textContent(),/unique/);
    // Quota failure cannot claim success, clear a name or lose an earlier save.
    await page.evaluate(k=>{window.storageSet435=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===k)throw new DOMException('full','QuotaExceededError');return window.storageSet435.call(this,key,value);};},key);
    await page.locator('#offlineSavedName435').fill('Evening');await page.locator('#offlineSavedSave435').click();assert.equal(await count(),1);assert.match(await page.locator('#offlineSavedStatus435').textContent(),/could not/);assert.equal(await page.locator('#offlineSavedName435').inputValue(),'Evening');await page.evaluate(()=>Storage.prototype.setItem=window.storageSet435);
    for(let i=0;i<2;i++){
      await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.locator('#offlineSaved435').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===2);
      assert.equal(await count(),1);assert.equal(await page.locator('#offlineSessionRows435 li').count(),0);await page.locator('.offline-saved-load435').click();assert.equal(await page.locator('#offlineSessionRows435 li').count(),2);assert.equal(await page.locator('#lpVideo').getAttribute('src'),null);
    }
    // Loading with a draft asks first; Cancel is non-destructive.
    await page.locator('#offlineSessionRows435 li').last().locator('[data-session-action=remove]').click();assert.equal(await page.locator('#offlineSessionRows435 li').count(),1);
    await page.locator('.offline-saved-load435').click();await page.locator('#vpAskBg .vp-ask-row button:first-child').click();assert.equal(await page.locator('#offlineSessionRows435 li').count(),1);
    await page.locator('.offline-saved-load435').click();await page.locator('#vpAskBg .vp-ask-row button:last-child').click();assert.equal(await page.locator('#offlineSessionRows435 li').count(),2);
    // Saved metadata rides the app's real backup export. It contains no media bytes.
    const download=page.waitForEvent('download');await page.locator('#libExport').click();const d=await download;const backup=JSON.parse(fs.readFileSync(await d.path(),'utf8'));assert.deepEqual(backup.settings[key],expected);assert.equal(JSON.stringify(backup.settings[key]).includes('RIFF'),false);
    // Import validates metadata and updates the saved list in-place, without a reload.
    const importBackup={settings:{[key]:expected.concat([{key:'bad',name:'Invalid',files:[null]}])}};
    await page.evaluate(k=>localStorage.removeItem(k),key);
    await page.locator('#libImportFile').setInputFiles({name:'sessions-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(importBackup))});
    await page.waitForFunction(k=>!!localStorage.getItem(k),key);
    assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),expected);
    assert.equal(await count(),1);
    // Concurrent changes while a removal dialog is open must not delete a replacement.
    await page.locator('.offline-saved-remove435').click();await page.evaluate(k=>{const a=JSON.parse(localStorage.getItem(k));a[0].name='Changed elsewhere';localStorage.setItem(k,JSON.stringify(a));},key);await page.locator('#vpAskBg .vp-ask-row button:last-child').click();assert.equal(await count(),1);assert.match(await page.locator('#offlineSavedStatus435').textContent(),/another tab/);
    await page.setViewportSize({width:390,height:844});
    for(const lang of ['en','hi','gu']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await page.locator('#langBtn').click();assert.ok(await page.locator('#offlineSaved435').evaluate(e=>e.scrollWidth<=e.clientWidth+1));if(lang!=='en')assert.ok(!(await page.locator('#offlineSaved435 > summary').textContent()).includes('Saved'));}
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx');});
    // Remove only a saved recipe; copies and current draft remain.
    await page.locator('.offline-saved-remove435').click();await page.locator('#vpAskBg .vp-ask-row button:last-child').click();assert.equal(await count(),0);assert.equal(await page.locator('#offlineRows432 article').count(),2);assert.equal(await page.locator('#offlineSessionRows435 li').count(),2);
    assert.equal(await page.locator('#offlineSaved435').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
    assert.deepEqual(errors,[]);console.log('Named offline sessions: durable two-load save, case-insensitive uniqueness, quota errors, cancel/confirm draft loading, backup metadata, concurrent-edit deletion guard, translated 390px and non-destructive deletion pass');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

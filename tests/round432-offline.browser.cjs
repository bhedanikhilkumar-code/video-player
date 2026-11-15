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
    page.on('pageerror', e => {errors.push(e.message);console.error('PAGE',e.stack);});
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    const samples=8000*12, wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
    fs.writeFileSync('/tmp/Own practice.wav',wav);fs.writeFileSync('/tmp/not-media432.txt','not a media file');const good='/tmp/Own practice.wav';
    await page.locator('#offlineShelf432 > summary').click();
    await page.locator('#offlineFiles432').setInputFiles([good,'/tmp/not-media432.txt']);
    await page.waitForFunction(()=>document.getElementById('offlineStatus432').textContent.includes('Saved: 1. Already saved: 0. Not saved: 1.'));
    assert.equal(await page.locator('.offline-row432').count(),1);
    await page.locator('#offlineFiles432').setInputFiles([good]);await page.waitForFunction(()=>document.getElementById('offlineStatus432').textContent.includes('Already saved: 1'));
    assert.equal(await page.locator('.offline-row432').count(),1);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('.offline-row432').length===1);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('.offline-row432').length===1);
    await context.setOffline(true);await page.locator('.offline-open432').click();await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);assert.equal(await page.locator('#lpVideo').getAttribute('data-file-name276'),'Own practice.wav');
    await page.locator('#lpVideo').evaluate(async v=>{await v.play();});await page.waitForFunction(()=>document.getElementById('lpVideo').currentTime>.1);await page.locator('#lpVideo').evaluate(v=>v.pause());
    await context.setOffline(false);
    await page.setViewportSize({width:390,height:844});
    for(const lang of ['en','hi','gu']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);assert.ok(await page.locator('#offlineShelf432').evaluate(e=>e.scrollWidth<=e.clientWidth+1));if(lang!=='en')assert.ok(!(await page.locator('#offlineShelf432 > summary').textContent()).includes('Offline'));await page.locator('#offlineShelf432').screenshot({path:'/downloads/432-offline-'+lang+'.png'});}
    // Fail the actual transaction write. No saved row or successful count may leak out.
    await page.evaluate(()=>{window.originalPut432=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){if(this.name==='files')throw new DOMException('Full','QuotaExceededError');return window.originalPut432.apply(this,arguments);};});
    await page.locator('#offlineFiles432').setInputFiles([{name:'Second.wav',mimeType:'audio/wav',buffer:wav}]);
    await page.waitForFunction(()=>document.getElementById('offlinePick432').disabled===false);await page.waitForTimeout(200);
    assert.equal(await page.locator('.offline-row432').count(),1,'failed transaction must not leave metadata without a file');
    await page.evaluate(()=>{IDBObjectStore.prototype.put=window.originalPut432;});
    for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!=='en';n++)await languageTap(page);
    await page.locator('.offline-delete432').click();await page.locator('#vpAskBg .vp-ask-row button:first-child').click();assert.equal(await page.locator('.offline-row432').count(),1);
    await page.locator('.offline-delete432').click();await page.locator('#vpAskBg .vp-ask-row button:last-child').click();await page.waitForFunction(()=>!document.querySelector('.offline-row432'));
    assert.match(await page.locator('#offlineStatus432').textContent(),/removed/);
    assert.deepEqual(errors,[]);console.log('Offline shelf: owned file save, duplicate/invalid file handling, two fresh loads, real playback with browser offline, Hindi/Gujarati at 390px, atomic quota failure and confirmed removal pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

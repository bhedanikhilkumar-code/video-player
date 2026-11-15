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
    const fixture='/tmp/round437/Recovery.wav';fs.writeFileSync(fixture,wav);
    await page.locator('#offlineShelf432 > summary').click();await page.locator('#offlineFiles432').setInputFiles(fixture);await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===1);
    const corrupt=async size=>page.evaluate(async size=>{const d=await new Promise((resolve,reject)=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const tx=d.transaction(['meta','files'],'readwrite'),m=tx.objectStore('meta').getAll();m.onsuccess=()=>{const id=m.result[0].id;if(size===null)tx.objectStore('files').delete(id);else tx.objectStore('files').put(new Blob([new Uint8Array(size)],{type:'audio/wav'}),id);};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});d.close();},size);
    const bytes=()=>page.evaluate(async()=>{const d=await new Promise(resolve=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);});const out=await new Promise(resolve=>{const tx=d.transaction('files','readonly'),r=tx.objectStore('files').getAll();tx.oncomplete=()=>resolve(r.result.map(b=>b.size));});d.close();return out;});
    await page.locator('#offlineSessionAll435').click();await page.locator('#offlineSaved435 > summary').click();await page.locator('#offlineSavedName435').fill('Saved warmup');await page.locator('#offlineSavedSave435').click();
    for(const size of [null,7]){
      await corrupt(size);await page.locator('#offlineShelf432 > summary').click();await page.locator('#offlineShelf432 > summary').click();await page.waitForFunction(()=>!document.querySelector('.offline-health437').hidden);assert.match(await page.locator('#offlineSavedRows435 article').textContent(),/Missing or incomplete saved copies: 1/);
      for(const lang of ['hi','gu','en']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);assert.equal(await page.locator('.offline-health437').isVisible(),true);if(lang!=='en')assert.ok(!(await page.locator('.offline-health437').textContent()).includes('Saved copy'));}
      await page.locator('#offlineFiles432').setInputFiles(fixture);await page.waitForFunction(()=>document.querySelector('.offline-health437').hidden);assert.deepEqual(await bytes(),[wav.length]);assert.ok(!(await page.locator('#offlineSavedRows435 article').textContent()).includes('incomplete saved copies'));
    }
    for(let i=0;i<2;i++){await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('.offline-health437').length===1);assert.equal(await page.locator('.offline-health437').isVisible(),false);assert.deepEqual(await bytes(),[wav.length]);}
    assert.deepEqual(errors,[]);console.log('Shelf and saved-session availability are computed from actual blob presence and sizes, not metadata; missing and truncated warnings clear after re-saving; EN/HI/GU and two loads pass');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

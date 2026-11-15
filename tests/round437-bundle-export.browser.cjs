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
    const crypto=require('crypto');
    await page.locator('#offlineShelf432 > summary').click();await page.locator('#offlineFiles432').setInputFiles([{name:'Warmup.wav',mimeType:'audio/wav',buffer:wav},{name:'Practice.wav',mimeType:'audio/wav',buffer:wav}]);await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===2);
    await page.locator('#offlineBundle437 > summary').click();const download=page.waitForEvent('download');await page.locator('#offlineBundleExport437').click();const d=await download;
    const bytes=fs.readFileSync(await d.path()),magic=Buffer.from('VP-OFFLINE-1\n');assert.deepEqual(bytes.subarray(0,magic.length),magic);const len=bytes.readUInt32LE(magic.length),manifest=JSON.parse(bytes.subarray(magic.length+4,magic.length+4+len));assert.equal(manifest.files.length,2);assert.equal(manifest.format,'vp-offline-bundle');let offset=magic.length+4+len;
    for(const f of manifest.files){const data=bytes.subarray(offset,offset+f.size);assert.deepEqual(data,wav);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),f.sha256);assert.equal(f.id,JSON.stringify([f.name,f.size,f.modified]));offset+=f.size;}assert.equal(offset,bytes.length);assert.equal(Object.hasOwn(manifest,'settings'),false);assert.equal(Object.hasOwn(manifest,'sessions'),false);
    await page.setViewportSize({width:390,height:844});for(const lang of ['hi','gu','en']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await page.locator('#langBtn').click();assert.ok(await page.locator('#offlineBundle437').evaluate(e=>e.scrollWidth<=e.clientWidth+1));if(lang!=='en')assert.ok(!(await page.locator('#offlineBundleHint437').textContent()).includes('Save all'));}
    await page.locator('#offlineBundle437').screenshot({path:'/downloads/437-bundle-export-local.png'});
    // No partial archive is downloaded when any copy is absent.
    await page.evaluate(async()=>{const d=await new Promise(resolve=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);});await new Promise(resolve=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').clear();tx.oncomplete=resolve;});d.close();});let downloads=0;page.on('download',()=>downloads++);await page.locator('#offlineBundleExport437').click();await page.waitForFunction(()=>!document.getElementById('offlineBundleExport437').disabled);assert.match(await page.locator('#offlineBundleStatus437').textContent(),/could not be created/);assert.equal(downloads,0);
    assert.equal(await page.locator('#offlineRows432 article').count(),2);assert.deepEqual(errors,[]);console.log('Offline bundle export: byte-identical files, validated identities and SHA256 in standalone container; EN/HI/GU 390px; no partial download or mutation on missing copies pass');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

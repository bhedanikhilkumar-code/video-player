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
    await page.locator('#lpFile').setInputFiles({name:'Current.wav',mimeType:'audio/wav',buffer:wav});await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276==='Current.wav');
    const before=await page.evaluate(()=>({queue:window.vpLocalPlan276().files,source:document.getElementById('lpVideo').src}));
    await page.locator('#offlineShelf432 > summary').click();await page.locator('#offlineFiles432').setInputFiles({name:'Broken.wav',mimeType:'audio/wav',buffer:wav});await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===1);
    await page.locator('#offlineSessionAll435').click();
    await page.evaluate(async()=>{const d=await new Promise(resolve=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);});await new Promise(resolve=>{const tx=d.transaction(['meta','files'],'readwrite'),r=tx.objectStore('meta').getAll();r.onsuccess=()=>tx.objectStore('files').put(new Blob(['short'],{type:'audio/wav'}),r.result[0].id);tx.oncomplete=resolve;});d.close();});
    await page.locator('#offlineSessionOpen435').click();await page.waitForFunction(()=>!document.getElementById('offlineSessionOpen435').disabled);assert.match(await page.locator('#offlineStatus432').textContent(),/could not open/);
    assert.deepEqual(await page.evaluate(()=>({queue:window.vpLocalPlan276().files,source:document.getElementById('lpVideo').src})),before);assert.equal(await page.locator('#offlineRows432 article').count(),1);assert.equal(await page.locator('#offlineSessionRows435 li').count(),1);assert.deepEqual(errors,[]);console.log('Incomplete offline bytes rejected without changing the playing queue, draft, shelf or requesting a misleading original-file download');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

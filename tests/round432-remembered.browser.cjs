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
    await page.evaluate(async bytes=>{
      const root=await navigator.storage.getDirectory(),h=await root.getFileHandle('Remembered song.wav',{create:true}),w=await h.createWritable();await w.write(new Uint8Array(bytes));await w.close();
      const d=await new Promise((resolve,reject)=>{let r=indexedDB.open('vp-remember.v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
      await new Promise((resolve,reject)=>{let t=d.transaction('files','readwrite');t.objectStore('files').put(h,h.name);t.oncomplete=resolve;t.onerror=()=>reject(t.error);});d.close();
    },Array.from(wav));
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.waitForFunction(()=>document.querySelector('#lpRemList button'));
    await page.locator('#lpFile').setInputFiles([{name:'Unrelated first.wav',mimeType:'audio/wav',buffer:wav},{name:'Unrelated second.wav',mimeType:'audio/wav',buffer:wav}]);await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);
    await page.locator('#lpRemList button').first().click();await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);
    await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276==='Remembered song.wav');
    assert.equal(await page.locator('#lpVideo').getAttribute('data-file-name276'),'Remembered song.wav');assert.equal(await page.locator('#lpPickName').textContent(),'Remembered song.wav');
    assert.deepEqual(await page.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name)),['Remembered song.wav']);assert.equal(await page.locator('#lpNext').isDisabled(),true);
    await page.locator('#carBtn287').click();assert.equal(await page.locator('.car-title').textContent(),'Remembered song.wav');await page.locator('.car-exit').click();
    assert.deepEqual(errors,[]);console.log('Remembered local file: genuine persisted file handle keeps filename, file metadata, one-file queue and Car mode title, replacing an unrelated picked playlist.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

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
    const files=[{name:'First.wav',mimeType:'audio/wav',buffer:wav},{name:'Second.wav',mimeType:'audio/wav',buffer:wav},{name:'Third.wav',mimeType:'audio/wav',buffer:wav}];
    await page.locator('#offlineShelf432 > summary').click();
    await page.locator('#offlineFiles432').setInputFiles(files);
    await page.waitForFunction(()=>document.querySelectorAll('.offline-row432 .offline-choose435').length===3);
    assert.equal(await page.locator('#offlineSessionOpen435').isDisabled(),true);
    const article=name=>page.locator('#offlineRows432 article').filter({has:page.locator('strong',{hasText:name})});
    await article('First.wav').locator('input').check();await article('Third.wav').locator('input').check();
    assert.deepEqual(await page.locator('#offlineSessionRows435 li > strong').allTextContents(),['First.wav','Third.wav']);
    await page.locator('#offlineSessionRows435 li').last().locator('[data-session-action=up]').click();
    assert.deepEqual(await page.locator('#offlineSessionRows435 li > strong').allTextContents(),['Third.wav','First.wav']);
    assert.equal(await page.locator('#offlineSessionRows435 li').first().locator('[data-session-action=down]').evaluate(e=>e===document.activeElement),true);
    await page.locator('#offlineSessionRows435 li').first().locator('[data-session-action=down]').click();
    await page.locator('#offlineSessionRows435 li').last().locator('[data-session-action=remove]').click();
    assert.equal(await article('Third.wav').locator('input').isChecked(),false);
    await page.locator('#offlineSessionAll435').click();
    assert.equal(await page.locator('#offlineSessionRows435 li').count(),3);
    const order=await page.locator('#offlineSessionRows435 li > strong').allTextContents();
    await context.setOffline(true);await page.locator('#offlineSessionOpen435').click();
    await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);
    assert.deepEqual(await page.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name)),order);
    await page.locator('#lpNext').click();await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276!=="First.wav");
    assert.equal(await page.locator('#lpVideo').getAttribute('data-file-name276'),order[1]);
    await page.locator('#lpPrev').click();assert.equal(await page.locator('#lpVideo').getAttribute('data-file-name276'),order[0]);
    await context.setOffline(false);
    // A missing blob fails the whole operation rather than replacing the current queue with a partial one.
    const before=await page.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name));
    await page.evaluate(async()=>{const d=await new Promise((resolve,reject)=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const tx=d.transaction(['meta','files'],'readwrite');const r=tx.objectStore('meta').getAll();r.onsuccess=()=>tx.objectStore('files').delete(r.result.find(x=>x.name==='Third.wav').id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});d.close();});
    await page.locator('#offlineSessionOpen435').click();await page.waitForFunction(()=>document.getElementById('offlineStatus432').textContent.includes('could not open'));
    assert.deepEqual(await page.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name)),before);
    assert.equal(await page.locator('#offlineSessionOpen435').isDisabled(),false);
    await page.setViewportSize({width:390,height:844});
    for(const lang of ['en','hi','gu']){
      for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await page.locator('#langBtn').click();
      assert.ok(await page.locator('#offlineSession435').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      if(lang!=='en'){assert.ok(!(await page.locator('#offlineSessionTitle435').textContent()).includes('Offline'));assert.ok(!(await article('First.wav').locator('label').textContent()).includes('Include'));}
      await page.locator('#offlineSession435').screenshot({path:'/downloads/435-session-'+lang+'.png'});
    }
    // Draft controls do not delete copies or change the playing queue.
    await page.locator('#offlineSessionClear435').click();assert.equal(await page.locator('#offlineSessionRows435 li').count(),0);assert.equal(await page.locator('#offlineRows432 article').count(),3);
    assert.deepEqual(await page.evaluate(()=>window.vpLocalPlan276().files.map(f=>f.name)),before);
    for(let i=0;i<2;i++){await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.waitForFunction(()=>document.querySelectorAll('#offlineRows432 article').length===3);assert.equal(await page.locator('#offlineSessionRows435 li').count(),0);}
    assert.deepEqual(errors,[]);console.log('Offline session builder: select, reorder with focus, remove, add all, offline playback and next/previous, atomic missing-copy failure, non-destructive clear, Hindi/Gujarati at 390px and two fresh loads pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

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
    const crypto=require('crypto');const magic=Buffer.from('VP-OFFLINE-1\n');
    const metas=['Warmup.wav','Practice.wav'].map((name,i)=>({name,size:wav.length,type:'audio/wav',modified:1700000000000+i,id:JSON.stringify([name,wav.length,1700000000000+i]),sha256:crypto.createHash('sha256').update(wav).digest('hex')}));
    function archive(entries=metas,payload=Buffer.concat([wav,wav]),version=1){const json=Buffer.from(JSON.stringify({format:'vp-offline-bundle',version,files:entries}));const len=Buffer.alloc(4);len.writeUInt32LE(json.length);return Buffer.concat([magic,len,json,payload]);}
    const upload=async data=>{await page.locator('#offlineBundleFile437').setInputFiles({name:'media.vpoffline',mimeType:'application/octet-stream',buffer:data});await page.waitForFunction(()=>!document.getElementById('offlineBundlePick437').disabled);};
    const dbAction=async(fn,arg)=>page.evaluate(async({fn,arg})=>{const d=await new Promise((resolve,reject)=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});try{return await new Promise((resolve,reject)=>{const tx=d.transaction(['meta','files'],'readwrite'),m=tx.objectStore('meta'),f=tx.objectStore('files');if(fn==='clear'){m.clear();f.clear();}if(fn==='capacity'){m.clear();f.clear();for(let i=0;i<19;i++){const name='Other'+i+'.wav',id=JSON.stringify([name,1,0]);m.put({id,name,size:1,type:'audio/wav',modified:0,added:i});f.put(new Blob(['x']),id);}}if(fn==='truncate')f.put(new Blob(['bad']),arg);const mr=m.getAll(),fr=f.getAll();tx.oncomplete=()=>resolve({meta:mr.result,bytes:fr.result.map(b=>b.size)});tx.onabort=()=>reject(tx.error);});}finally{d.close();}},{fn,arg});
    const counts=()=>dbAction('read');
    await page.locator('#offlineShelf432 > summary').click();await page.locator('#offlineBundle437 > summary').click();
    // Parsing is bounded and refuses damaged bytes, duplicate references, trailing data,
    // bad versions and unsupported files before any IndexedDB write.
    const damaged=archive();damaged[damaged.length-1]^=1;
    const badIdentity=metas.map(x=>({...x}));badIdentity[0].id='not-an-id';
    for(const bad of [Buffer.from('bad'),damaged,archive().subarray(0,-1),Buffer.concat([archive(),Buffer.from('extra')]),archive([metas[0],metas[0]]),archive(badIdentity),archive(metas,Buffer.concat([wav,wav]),2)]){await upload(bad);assert.match(await page.locator('#offlineBundleImportStatus437').textContent(),/invalid, damaged/);assert.equal((await counts()).meta.length,0);assert.equal(await page.locator('#offlineBundleRestore437').isVisible(),false);}
    await upload(archive());assert.equal(await page.locator('#offlineBundleReview437 li').count(),2);assert.equal((await counts()).meta.length,0);await page.locator('#offlineBundleCancel437').click();assert.equal(await page.locator('#offlineBundleReview437 li').count(),0);assert.equal((await counts()).meta.length,0);
    await upload(archive());
    // A second write fails after the first was queued. Both stores roll back.
    await page.evaluate(()=>{window.originalPut437=IDBObjectStore.prototype.put;let n=0;IDBObjectStore.prototype.put=function(...args){if(this.name==='files'&&++n===2)throw new DOMException('quota','QuotaExceededError');return window.originalPut437.apply(this,args);};});
    await page.locator('#offlineBundleRestore437').click();await page.waitForFunction(()=>!document.getElementById('offlineBundleRestore437').disabled);assert.match(await page.locator('#offlineBundleImportStatus437').textContent(),/whole restore was rolled back/);assert.deepEqual((await counts()).bytes,[]);assert.equal((await counts()).meta.length,0);assert.equal(await page.locator('#offlineBundleReview437 li').count(),2);await page.evaluate(()=>IDBObjectStore.prototype.put=window.originalPut437);
    await page.locator('#offlineBundleRestore437').click();await page.waitForFunction(()=>document.getElementById('offlineBundleImportStatus437').textContent.includes('Bundle restored.'));assert.deepEqual((await counts()).bytes,[wav.length,wav.length]);assert.equal(await page.locator('#offlineRows432 article').count(),2);
    await page.locator('#offlineSessionAll435').click();await page.locator('#offlineSessionOpen435').click();await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276);const queue=await page.evaluate(()=>window.vpLocalPlan276().files);const draft=await page.locator('#offlineSessionRows435').textContent();
    // Repair one incomplete entry while preserving an existing healthy copy and queue.
    await dbAction('truncate',metas[0].id);await upload(archive());
    await page.setViewportSize({width:390,height:844});for(const lang of ['hi','gu','en']){for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);assert.equal(await page.locator('#offlineBundleReview437 li').count(),2);assert.ok(await page.locator('#offlineBundle437').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.locator('#offlineBundleImport437').screenshot({path:'/downloads/437-bundle-import-'+lang+'.png'});}
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx');});await page.locator('#offlineBundleRestore437').click();await page.waitForFunction(()=>document.getElementById('offlineBundleImportStatus437').textContent.includes('Bundle restored.'));assert.match(await page.locator('#offlineBundleImportStatus437').textContent(),/repaired: 1.*kept: 1/);assert.deepEqual(await page.evaluate(()=>window.vpLocalPlan276().files),queue);assert.equal(await page.locator('#offlineSessionRows435').textContent(),draft);
    // Read original bytes, not just sizes, after two actual fresh page loads.
    for(let i=0;i<2;i++){await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.deepEqual((await counts()).bytes,[wav.length,wav.length]);const hashes=await page.evaluate(async()=>{const d=await new Promise(resolve=>{const r=indexedDB.open('vp-offline-media432.v1',1);r.onsuccess=()=>resolve(r.result);});const bs=await new Promise(resolve=>{const tx=d.transaction('files'),r=tx.objectStore('files').getAll();tx.oncomplete=()=>resolve(r.result);});d.close();return Promise.all(bs.map(async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await b.arrayBuffer()))).map(n=>n.toString(16).padStart(2,'0')).join('')));});assert.deepEqual(hashes,metas.map(m=>m.sha256));}
    await page.locator('#offlineShelf432').evaluate(e=>e.open=true);await page.locator('#offlineBundle437').evaluate(e=>e.open=true);await upload(archive());await dbAction('capacity');await page.locator('#offlineBundleRestore437').click();await page.waitForFunction(()=>!document.getElementById('offlineBundleRestore437').disabled);assert.match(await page.locator('#offlineBundleImportStatus437').textContent(),/Not enough shelf space/);assert.equal((await counts()).meta.length,19);assert.ok((await counts()).meta.every(x=>x.name.startsWith('Other')));
    assert.deepEqual(errors,[]);console.log('Offline bundle restore: bounded parser and SHA256 verification, explicit preview/cancel, atomic quota rollback, repair/keep semantics, untouched draft and player, concurrent capacity limits, two-load byte integrity, EN/HI/GU 390px pass');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

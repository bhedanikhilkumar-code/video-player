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
    await page.route('**/*', route => route.request().url().includes('youtube-nocookie.com/embed/') ? route.fulfill({contentType:'text/html',body:'<!doctype html><title>Test player</title>'}) : route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Make a real pre-import restore point through the actual file input and its reload.
    const imported=page.waitForEvent('load');await page.locator('#libImportFile').setInputFiles({name:'settings.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({settings:{'vp-offline-sessions435.v1':[]}}))});await imported;await page.waitForFunction(()=>window.__vpMainOk325);
    const anchor=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('vp-import-undo')));assert.ok(anchor);
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');await page.locator('#loadBtn').click();await page.locator('#controls').waitFor({state:'visible'});
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:175,duration:214});await playerEvent('onStateChange',1);
    await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
    assert.notEqual(await page.evaluate(()=>localStorage.getItem('vp-library.v1')),anchor['vp-library.v1']);
    const undone=page.waitForEvent('load');await page.locator('#libUndoImport').click();await undone;await page.waitForFunction(()=>window.__vpMainOk325);
    const after=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
    const changed=Object.keys({...anchor,...after}).filter(k=>anchor[k]!==after[k]);console.log('Undo changed keys:',changed);
    if(process.env.BEFORE){assert.ok(changed.includes('vp-library.v1'));return;}
    assert.deepEqual(changed,[],'post-restore playback and pagehide hooks must not overwrite the pre-import snapshot');
    assert.deepEqual(errors,[]);console.log('Undo import restores every original localStorage value even after playing a different position; the next page applies the snapshot before startup, so old playback and pagehide writes cannot win.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

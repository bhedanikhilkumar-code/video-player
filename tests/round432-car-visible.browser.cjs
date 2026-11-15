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
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().includes('youtube-nocookie.com/embed/') ? route.fulfill({contentType:'text/html',body:'<!doctype html><title>Test player</title>'}) : route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',1);
    await page.locator('#frameBox iframe').evaluate(e=>{window.originalCarFrame432=e;window.originalCarWindow432=e.contentWindow;});
    for(const lang of ['en','hi','gu']){
      await page.setViewportSize({width:390,height:844});
      for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);
      await page.locator('#carBtn287').click();
      await page.waitForFunction(()=>document.documentElement.classList.contains('car-video432'));
      assert.equal(await page.locator('#frameBox iframe').evaluate(e=>e===window.originalCarFrame432&&e.contentWindow===window.originalCarWindow432),true,'iframe stays alive, not reparented');
      const bounds=await page.evaluate(()=>({v:document.getElementById('frameBox').getBoundingClientRect().toJSON(),c:document.querySelector('.car-content432').getBoundingClientRect().toJSON(),top:document.elementFromPoint(195,100)?.closest('#playerDock')?.id}));
      assert.equal(await page.locator('#playerDock').evaluate(e=>e.matches(':popover-open')),true);await page.screenshot({path:'/downloads/432-car-visible-'+lang+'.png'});assert.ok(bounds.v.width>=200&&bounds.v.height>=200);assert.ok(bounds.c.top>=bounds.v.bottom,'controls are below visible video');
      await page.locator('.car-play').click();
      await page.locator('.car-exit').click();await page.waitForFunction(()=>!window.__vpCarVideo432);
      assert.equal(await page.locator('#vpCar287').count(),0);assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('car-video432')),false);
      assert.equal(await page.locator('#frameBox iframe').evaluate(e=>e===window.originalCarFrame432&&e.contentWindow===window.originalCarWindow432),true);
    }
    // Works from an already-docked player; resize must not put it behind the modal.
    await page.locator('#library').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.getElementById('playerDock').classList.contains('is-mini'));
    await page.locator('#carBtn287').click();await page.setViewportSize({width:844,height:390});
    await page.waitForFunction(()=>window.__vpCarVideo432&&document.getElementById('playerDock').matches(':popover-open'));
    await page.locator('.car-exit').click();assert.equal(await page.locator('#frameBox iframe').evaluate(e=>e===window.originalCarFrame432),true);
    assert.deepEqual(errors,[]);console.log('Car mode keeps the original YouTube iframe visible above the modal, with controls below it; three languages at 390px, already-docked state, landscape resize and close restore pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

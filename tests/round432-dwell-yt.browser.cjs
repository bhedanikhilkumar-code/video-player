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
    // Scroll deliberately cancels dwell. Keep test navigation instant so hover is not cancelled by a pending smooth-scroll frame.
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');await page.locator('#loadBtn').click();
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',2);
    await page.locator('#dwellCard432 > summary').click();
    await page.waitForFunction(()=>document.getElementById('playerDock').classList.contains('is-mini'));
    await page.waitForFunction(()=>document.getElementById('dwellEnable432').getBoundingClientRect().top>=document.getElementById('playerDock').getBoundingClientRect().bottom+12);
    await page.locator('#dwellTime432').selectOption('1000');
    await page.locator('#dwellEnable432').click();assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'true');
    await page.locator('.dwell-action432').nth(3).hover();await page.waitForTimeout(1300);
    assert.equal(await page.locator('#vol').inputValue(),'75');
    await page.waitForTimeout(1200);assert.equal(await page.locator('#vol').inputValue(),'75');
    // Keyboard/touch remain ordinary one-action buttons, not hover activation.
    await page.locator('.dwell-action432').nth(5).dispatchEvent('pointerenter',{pointerType:'touch',clientX:1,clientY:1});await page.waitForTimeout(1200);assert.equal(await page.locator('#vol').inputValue(),'75');
    await page.keyboard.press('Escape');assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'false');
    for(const lang of ['hi','gu']){await languageTap(page);await page.locator('#dwellCard432 > summary').click();await page.locator('#dwellCard432 > summary').click();await page.waitForFunction(()=>document.getElementById('dwellEnable432').getBoundingClientRect().top>=document.getElementById('playerDock').getBoundingClientRect().bottom+12);assert.ok(await page.locator('#dwellCard432').evaluate(e=>e.scrollWidth<=e.clientWidth+1));}
    assert.deepEqual(errors,[]);console.log('Pointer rest: simulated YouTube volume control, one-shot mouse dwell, no touch hover action, Escape off and toolbar below mini video in Hindi/Gujarati at 390px pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

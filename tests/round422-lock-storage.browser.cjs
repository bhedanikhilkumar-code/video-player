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
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    await page.locator('#linkInput').fill('dQw4w9WgXcQ');await page.locator('#loadBtn').click();if(await page.locator('#help .sec-toggle').getAttribute('aria-expanded')!=='true')await page.locator('#help .sec-toggle').click();
    await page.locator('#lockSetBtn288').click();await page.locator('#lockIn1').fill('432198');await page.locator('#lockIn2').fill('432198');
    await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='vp-lock288.v1')throw new DOMException('full','QuotaExceededError');return original.call(this,k,v);};});
    await page.locator('#lockOkBtn288').click();
    assert.equal(await page.locator('#lockPanel288').evaluate(e=>e.hidden),false,'failed PIN save must keep the setup open');
    assert.match(await page.locator('#vpToast').textContent(),/Could not update app lock/);assert.equal(await page.evaluate(()=>localStorage.getItem('vp-lock288.v1')),null);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);
    await page.locator('#linkInput').fill('dQw4w9WgXcQ');await page.locator('#loadBtn').click();if(await page.locator('#help .sec-toggle').getAttribute('aria-expanded')!=='true')await page.locator('#help .sec-toggle').click();
    await page.locator('#lockSetBtn288').click();await page.locator('#lockIn1').fill('432198');await page.locator('#lockIn2').fill('432198');await page.locator('#lockOkBtn288').click();
    assert.equal(await page.locator('#lockPanel288').evaluate(e=>e.hidden),true);assert.ok(await page.evaluate(()=>localStorage.getItem('vp-lock288.v1')));
    await page.evaluate(()=>{const original=Storage.prototype.removeItem;Storage.prototype.removeItem=function(k){if(k==='vp-lock288.v1')throw new DOMException('denied','SecurityError');return original.call(this,k);};});
    await page.locator('#lockRmBtn288').click();assert.match(await page.locator('#vpToast').textContent(),/Could not update app lock/);assert.ok(await page.evaluate(()=>localStorage.getItem('vp-lock288.v1')));assert.equal(await page.locator('#lockRmBtn288').isVisible(),true);
    assert.deepEqual(errors,[]);console.log('App lock: quota failure keeps PIN setup open and never claims saved; failed removal preserves the existing lock and reports the error.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

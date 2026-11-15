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
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    await page.locator('#loopLibCard296').evaluate(e => e.open = true);
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 2);
    await page.evaluate(() => { window._set419 = Storage.prototype.setItem; Storage.prototype.setItem = function (key, value) { if (key === 'vp-practice-loops.v1') throw new DOMException('Full', 'QuotaExceededError'); return window._set419.call(this, key, value); }; });
    await page.locator('#loopLibList296').getByRole('button', { name: 'Remove this loop: Warmup', exact: true }).click();
    console.log('rows after rejected delete:', await page.locator('#loopLibList296 > .row').count());
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 2);
    assert.match(await page.locator('#vpToast').textContent(), /Could not save/);
    await page.locator('#loopLibList296').getByRole('button', { name: 'Rename this loop: Warmup', exact: true }).click();
    await page.locator('#vpAskBg input').fill('Renamed'); await page.locator('#vpAskBg').getByRole('button', { name: 'Save', exact: true }).click();
    assert.match(await page.locator('#loopLibList296').textContent(), /Warmup/);
    assert.doesNotMatch(await page.locator('#loopLibList296').textContent(), /Renamed/);
    assert.match(await page.locator('#vpToast').textContent(), /Could not save/);
    await page.evaluate(() => Storage.prototype.setItem = window._set419);
    await page.locator('#loopLibList296').getByRole('button', { name: 'Remove this loop: Warmup', exact: true }).click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 1);
    await page.evaluate(() => { Storage.prototype.setItem = function (key, value) { if (key === 'vp-practice-loops.v1') throw new DOMException('Full', 'QuotaExceededError'); return window._set419.call(this, key, value); }; });
    await page.locator('#vpToast .vp-undo').click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 1);
    assert.match(await page.locator('#vpToast').textContent(), /Could not save/);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('vp-practice-loops.v1')).dQw4w9WgXcQ.length), 1);
    await page.evaluate(() => Storage.prototype.setItem = window._set419);
    assert.deepEqual(errors, []); console.log('Loop library storage failures: remove, rename and undo roll back without false success.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

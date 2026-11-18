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
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en', langPick360:true, lowFxHinted:true })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    await page.locator('#tmCard418').evaluate(e=>e.open=true);
    const live=await page.locator('#tmFace418').getAttribute('aria-live');
    console.log('Countdown live region:',live);assert.equal(live,'off');
    await page.evaluate(()=>{window.timerMutations419=0;new MutationObserver(records=>window.timerMutations419+=records.length).observe(document.getElementById('tmFace418'),{childList:true});});
    await page.clock.install();await page.locator('#tmChips418 button').first().click();
    await page.clock.runFor(2100);assert.ok(await page.evaluate(()=>window.timerMutations419)<=4);
    assert.match(await page.locator('#vpToast').textContent(),/Timer running/);
    await page.locator('#tmGo418').click();assert.match(await page.locator('#vpToast').textContent(),/Timer paused/);
    await page.locator('#tmGo418').click();await page.clock.fastForward(60000);
    assert.match(await page.locator('#vpToast').textContent(),/Time's up/);
    assert.deepEqual(errors,[]);console.log('Countdown: ticking face is quiet; running, pause and completion still use the live status toast.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

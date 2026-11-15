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
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    await page.locator('#tmCard418').evaluate(e=>e.open=true);
    await page.evaluate(()=>{
      window.audioArmed419=[];window.audioBeeps419=0;const Native=window.AudioContext;
      window.AudioContext=class extends Native { constructor(...args){super(...args);window.audioArmed419.push({event:window.event?.type,trusted:window.event?.isTrusted});} createOscillator(){window.audioBeeps419++;return super.createOscillator();} };
    });
    await page.clock.install();await page.locator('#tmChips418 button').first().click();
    console.log('audio contexts immediately after Start:',await page.evaluate(()=>window.audioArmed419));
    assert.deepEqual(await page.evaluate(()=>window.audioArmed419),[{event:'click',trusted:true}]);
    await page.clock.fastForward(61000);
    assert.equal(await page.evaluate(()=>window.audioArmed419.length),1);
    assert.equal(await page.evaluate(()=>window.audioBeeps419),3);
    await page.locator('#tmAgain418').click();await page.locator('#tmGo418').click();await page.locator('#tmGo418').click();
    assert.equal(await page.evaluate(()=>window.audioArmed419.length),1);
    await page.locator('#tmReset418').click();assert.deepEqual(errors,[]);
    console.log('Countdown sound is armed in a trusted Start gesture, reused on finish, Repeat and Resume; three tones scheduled. Device audibility is not asserted.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

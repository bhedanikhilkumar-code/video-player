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
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',1);
    await page.locator('#drillCard').evaluate(e=>e.open=true);
    await page.locator('#drRow').getByRole('button',{name:'Start drill',exact:true}).click();
    await languageTap(page);assert.equal(await page.locator('html').getAttribute('lang'),'hi');assert.match(await page.locator('#drMsg').textContent(),/ड्रिल: मोमेंट/);
    await languageTap(page);assert.equal(await page.locator('html').getAttribute('lang'),'gu');assert.match(await page.locator('#drMsg').textContent(),/ડ્રિલ: મોમેન્ટ/);
    await languageTap(page);await playerEvent('onStateChange',0);assert.match(await page.locator('#drMsg').textContent(),/Drill done - all 1/);
    await languageTap(page);assert.match(await page.locator('#drMsg').textContent(),/ड्रिल पूरी/);await languageTap(page);assert.match(await page.locator('#drMsg').textContent(),/ડ્રિલ પૂરી/);
    assert.deepEqual(errors,[]);console.log('Moment drill live progress and completion translate when switching languages mid-session.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

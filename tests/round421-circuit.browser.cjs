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
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',1);
    await page.locator('#circuit421').evaluate(e=>e.open=true);
    await page.locator('#circuitPick421').selectOption('0');await page.locator('#circuitAdd421').click();
    await page.locator('#circuitRows421 input').fill('2');await page.locator('#circuitRows421 input').press('Tab');
    await page.locator('#circuitPick421').selectOption('1');await page.locator('#circuitAdd421').click();
    assert.equal(await page.locator('#circuitRows421 li').count(),2);
    assert.match(await page.locator('#circuitLength421').textContent(),/0:20/);
    await page.locator('#circuitRows421 li').nth(1).getByRole('button',{name:'Move up',exact:true}).click();
    assert.match(await page.locator('#circuitRows421 li').first().textContent(),/Chorus/);
    await page.locator('#circuitRows421 li').first().getByRole('button',{name:'Move down',exact:true}).click();
    await page.locator('#circuitGo421').click();assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),true);
    assert.match(await page.locator('#circuitStatus421').textContent(),/loop 1 of 2, pass 1 of 2/);
    assert.equal(await page.locator('#circuitRows421 input').first().isDisabled(),true);
    await playerEvent('infoDelivery',{currentTime:10,duration:213});
    assert.match(await page.locator('#circuitStatus421').textContent(),/loop 1 of 2, pass 2 of 2/);
    await playerEvent('infoDelivery',{currentTime:10,duration:213});
    assert.match(await page.locator('#circuitStatus421').textContent(),/loop 2 of 2, pass 1 of 1/);
    await playerEvent('infoDelivery',{currentTime:30,duration:213});
    assert.match(await page.locator('#circuitStatus421').textContent(),/complete/);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.locator('#circuitGo421').click();await page.locator('#circuitNext421').click();
    assert.match(await page.locator('#circuitStatus421').textContent(),/loop 2 of 2/);
    await page.locator('#abToggle').click();assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.locator('#circuitGo421').click();
    for(const lang of ['hi','gu','en']) {await page.locator('#langBtn').click();await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('html').getAttribute('lang'),lang);assert.notEqual(await page.locator('#circuit421 > summary').textContent(),'');const size=await page.locator('#circuit421').evaluate(e=>({scroll:e.scrollWidth,client:e.clientWidth}));assert.ok(size.scroll<=size.client+1,JSON.stringify(size));}
    await page.evaluate(()=>document.documentElement.classList.add('high-contrast','low-fx','calm-motion'));
    await page.locator('#circuitGo421').click();await page.locator('#circuitGo421').click();await page.locator('#circuitNext421').click();
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    assert.deepEqual(errors,[]);console.log('Circuit: composition, order, individual passes, boundary advance, completion, skip, A-B cancellation, 390px, 3 languages, contrast/low effects and fresh/repeat loads pass with simulated player messages.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

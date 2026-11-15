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
    await page.setViewportSize({width:390,height:844});
    await page.locator('#loopLibCard296').evaluate(e=>e.open=true);
    for(let i=0;i<3;i++)await page.locator('#themeBtn').click();
    await page.evaluate(()=>document.documentElement.classList.add('high-contrast','calm-motion','low-fx'));
    await page.locator('#loopLibCard296').scrollIntoViewIfNeeded();
    await page.locator('#miniClose').waitFor({state:'visible'});await page.locator('#miniClose').click();
    await page.waitForFunction(()=>!document.getElementById('playerDock').classList.contains('is-mini'));
    const styles=await page.locator('select.chip').evaluateAll(nodes=>nodes.map(e=>({id:e.id,repeat:getComputedStyle(e).backgroundRepeat,size:getComputedStyle(e).backgroundSize,position:getComputedStyle(e).backgroundPosition})));
    console.log('loop filter contrast style:',styles.find(x=>x.id==='loopVideo419'));
    for(const style of styles){assert.equal(style.repeat,'no-repeat',style.id);assert.equal(style.size,'12px 8px',style.id);}
    await page.locator('#loopLibCard296').screenshot({path:'/tmp/vp419-loop-highcontrast-fixed.png'});
    await page.evaluate(()=>{document.documentElement.dataset.theme='light';});
    assert.equal(await page.locator('#loopVideo419').evaluate(e=>getComputedStyle(e).backgroundRepeat),'no-repeat');
    assert.deepEqual(errors,[]);console.log('Every chip select keeps one fixed-size contrast chevron in light and dark.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

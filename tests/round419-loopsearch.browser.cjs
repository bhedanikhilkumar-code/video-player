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
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-practice-loops.v1', JSON.stringify(Object.fromEntries(['dQw4w9WgXcQ','9bZkp7q19f0','kJQP7kiw5Fk','M7lc1UVf-VE','aqz-KE-bpKQ'].map((id,j)=>[id,Array.from({length:10},(_,i)=>({name:'Drill '+(j*10+i),a:i*10,b:i*10+5}))])))); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    await page.locator('#loopLibCard296').evaluate(e => e.open = true);
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 40);
    assert.equal(await page.locator('#loopCount419').textContent(), 'Showing 40 of 50 loops');
    await page.locator('#loopMore419').click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 50);
    assert.equal(await page.locator('#loopMore419').isVisible(), false);
    await page.locator('#loopSearch419').fill('Drill 49');
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 1);
    assert.match(await page.locator('#loopLibList296').textContent(), /Drill 49/);
    await page.locator('#loopClear419').click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 40);
    await page.locator('#loopVideo419').selectOption('aqz-KE-bpKQ');
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 10);
    await page.locator('#loopSearch419').fill('Missing exercise');
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 0);
    assert.match(await page.locator('#loopLibList296').textContent(), /No loops match/);
    await page.locator('#loopSearch419').fill('Drill 49');
    assert.equal(await page.locator('#loopLibList296 > .row').count(), 1);
    await page.setViewportSize({ width:390,height:844 });
    for (const lang of ['hi','gu','en']) {
      await languageTap(page);
      assert.equal(await page.evaluate(()=>window.__vpPrefs.lang),lang);
      assert.equal(await page.locator('#loopVideo419').inputValue(),'aqz-KE-bpKQ');
      assert.equal(await page.locator('#loopSearch419').inputValue(),'Drill 49');
      const dims=await page.locator('#loopLibCard296').evaluate(e=>({scroll:e.scrollWidth,client:e.clientWidth}));
      assert.ok(dims.scroll<=dims.client+1,JSON.stringify(dims));
      await page.locator('#loopLibCard296').screenshot({path:'/tmp/vp419-loop-'+lang+'.png'});
    }
    await page.locator('#loopClear419').click();
    await page.locator('#loopSearch419').fill('Drill 49');
    await page.locator('#loopLibList296').getByRole('button',{name:'Remove this loop: Drill 49',exact:true}).click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(),0);
    await page.locator('#vpToast .vp-undo').click();
    assert.equal(await page.locator('#loopLibList296 > .row').count(),1);
    assert.deepEqual(errors,[]);
    console.log('Loop browser: 50 loops, 40-row pagination, full-library search, video + text intersection, no results, clear, language repaint, mobile layout, remove and undo pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

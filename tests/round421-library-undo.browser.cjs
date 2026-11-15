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
    await page.locator('#loopLibCard296').evaluate(e=>e.open=true);
    await page.locator('#loopLibList296').getByRole('button',{name:'Remove this loop: Warmup',exact:true}).click();
    const other=await context.newPage();
    await other.route('**/*',route=>route.request().url().startsWith('http://localhost:8499')?route.continue():route.abort());
    await other.goto('http://localhost:8499');await other.waitForFunction(()=>window.__vpMainOk325);
    await other.evaluate(()=>{let x=JSON.parse(localStorage.getItem('vp-practice-loops.v1'));x.dQw4w9WgXcQ.push({name:'Warmup recreated elsewhere',a:5,b:10});localStorage.setItem('vp-practice-loops.v1',JSON.stringify(x));});
    await page.waitForFunction(()=>document.getElementById('loopLibList296').textContent.includes('Warmup recreated elsewhere'));
    await page.locator('#vpToast button').click();
    const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-practice-loops.v1')).dQw4w9WgXcQ);
    console.log('Library Undo rows:',rows);assert.equal(rows.length,2);assert.equal(rows.filter(x=>x.a===5&&x.b===10).length,1);assert.ok(rows.some(x=>x.name==='Warmup recreated elsewhere'));
    assert.deepEqual(errors,[]);console.log('Library Undo does not duplicate a loop recreated by another tab.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

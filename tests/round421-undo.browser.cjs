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
    await page.locator('#practiceList').getByRole('button',{name:'Remove: Warmup',exact:true}).click();
    const other=await context.newPage();
    await other.route('**/*',route=>route.request().url().startsWith('http://localhost:8499')?route.continue():route.abort());
    await other.goto('http://localhost:8499');await other.waitForFunction(()=>window.__vpMainOk325);
    await other.evaluate(()=>{let x=JSON.parse(localStorage.getItem('vp-practice-loops.v1'));x.dQw4w9WgXcQ[0].name='Renamed elsewhere';x.dQw4w9WgXcQ.push({name:'New elsewhere',a:40,b:50});localStorage.setItem('vp-practice-loops.v1',JSON.stringify(x));});
    await page.waitForFunction(()=>document.getElementById('practiceList').textContent.includes('New elsewhere'));
    await page.locator('#vpToast button').click();
    const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-practice-loops.v1')).dQw4w9WgXcQ);
    console.log('Rows after Undo:',rows);assert.equal(rows.length,3);assert.ok(rows.some(x=>x.name==='Renamed elsewhere'));assert.ok(rows.some(x=>x.name==='New elsewhere'));assert.ok(rows.some(x=>x.name==='Warmup'));
    assert.deepEqual(errors,[]);console.log('Per-video Undo preserves concurrent edits.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

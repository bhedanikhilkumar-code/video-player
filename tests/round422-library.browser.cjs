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
    const presets=[{key:'guitar',video:'dQw4w9WgXcQ',name:'Guitar warmup',steps:[{name:'Chorus',a:20,b:30,passes:3}]},{key:'dance',video:'9bZkp7q19f0',name:'Dance routine',steps:[{name:'Footwork',a:12,b:20,passes:2}]}];
    await page.evaluate(value=>{localStorage.setItem('vp-circuit-presets421.v1',JSON.stringify(value));document.dispatchEvent(new Event('vp-circuit-presets421-change'));},presets);
    await page.locator('#circuitLibrary422').evaluate(e=>e.open=true);assert.equal(await page.locator('#controls').evaluate(e=>e.hidden),true);
    assert.equal(await page.locator('#clResults422 article').count(),2);await page.locator('#clSearch422').fill('Footwork');assert.equal(await page.locator('#clResults422 article').count(),1);assert.match(await page.locator('#clResults422').textContent(),/Dance routine/);
    await page.locator('#clSearch422').fill('no such routine');assert.match(await page.locator('#clResults422').textContent(),/No circuits match/);await page.locator('#clSearch422').fill('');
    await page.locator('#clResults422 article').first().locator('summary').click();assert.match(await page.locator('#clResults422 article').first().textContent(),/0:20 - 0:30 × 3/);
    await page.locator('#clResults422').getByRole('button',{name:'Open circuit paused: Guitar warmup',exact:true}).click();assert.equal(await page.locator('#controls').evaluate(e=>e.hidden),false);assert.equal(await page.evaluate(()=>new URL(document.querySelector('#frameBox iframe').src).searchParams.get('autoplay')),null);assert.match(await page.locator('#circuitRows421').textContent(),/Chorus/);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    if(await page.locator('#miniClose').isVisible())await page.locator('#miniClose').click();
    await page.locator('#clResults422').getByRole('button',{name:'Open circuit paused: Dance routine',exact:true}).click();await page.locator('#vpAskBg').getByRole('button',{name:'Cancel',exact:true}).click();assert.match(await page.locator('#circuitRows421').textContent(),/Chorus/);
    await page.locator('#clResults422').getByRole('button',{name:'Open circuit paused: Dance routine',exact:true}).click();await page.locator('#vpAskBg').getByRole('button',{name:'Open circuit paused',exact:true}).click();assert.match(await page.locator('#circuitRows421').textContent(),/Footwork/);assert.match(await page.locator('#frameBox iframe').getAttribute('src'),/9bZkp7q19f0/);assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.locator('#clResults422').getByRole('button',{name:'Remove: Guitar warmup',exact:true}).click();assert.equal(await page.locator('#clResults422 article').count(),1);await page.locator('#vpToast button').click();assert.equal(await page.locator('#clResults422 article').count(),2);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#circuitLibrary422').evaluate(e=>e.open=true);assert.equal(await page.locator('#clResults422 article').count(),2);assert.equal(await page.locator('#controls').evaluate(e=>e.hidden),true);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);await page.locator('#circuitLibrary422').evaluate(e=>e.open=true);assert.equal(await page.locator('#clResults422 article').count(),2);
    for(const lang of ['en','hi','gu']){for(let i=0;i<3&&await page.locator('html').getAttribute('lang')!==lang;i++)await page.locator('#langBtn').click();await page.setViewportSize({width:390,height:844});await page.locator('#circuitLibrary422').screenshot({path:'/downloads/422-library-'+lang+'.png'});if(lang!=='en')assert.ok(!(await page.locator('#circuitLibrary422 > summary').textContent()).startsWith('Circuit library'));}
    assert.deepEqual(errors,[]);console.log('Circuit library: available before video load; all-video search, preview, paused open, replacement cancel/confirm, remove Undo, persistence and 390px languages pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

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
    await page.locator('#circuitPresets421').evaluate(e=>e.open=true);await page.locator('#circuitPresetName421').fill('Warmup routine');await page.locator('#circuitPresetSave421').click();
    await page.locator('#circuitPresetList421').getByRole('button',{name:'Load circuit preset: Warmup routine',exact:true}).click();await page.locator('#vpAskBg').waitFor({state:'visible'});
    const second=await context.newPage();await second.route('**/*',route=>route.request().url().startsWith('http://localhost:8499')?route.continue():route.abort());await second.goto('http://localhost:8499');await second.waitForFunction(()=>window.__vpMainOk325);
    await second.evaluate(()=>{let all=JSON.parse(localStorage.getItem('vp-circuit-presets421.v1'));all[0].video='9bZkp7q19f0';all[0].steps=[{name:'Different video loop',a:100,b:150,passes:4}];localStorage.setItem('vp-circuit-presets421.v1',JSON.stringify(all));});
    await page.locator('#vpAskBg').getByRole('button',{name:'Replace',exact:true}).click();
    assert.match(await page.locator('#circuitPresetStatus421').textContent(),/changed in another tab/);assert.match(await page.locator('#circuitRows421').textContent(),/Warmup/);assert.doesNotMatch(await page.locator('#circuitRows421').textContent(),/Different video loop/);await second.close();
    assert.deepEqual(errors,[]);console.log('Circuit preset load refuses a changed or moved preset after confirmation, leaving the original draft untouched.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

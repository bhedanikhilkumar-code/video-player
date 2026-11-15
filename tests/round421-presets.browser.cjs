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
    await page.locator('#circuitPresets421').evaluate(e=>e.open=true);
    await page.locator('#circuitPresetName421').fill('Guitar warmup');await page.locator('#circuitPresetSave421').click();
    assert.match(await page.locator('#circuitPresetStatus421').textContent(),/saved/);
    const download=page.waitForEvent('download');await page.locator('#libExport').click();const backup=await download;const saved=JSON.parse(fs.readFileSync(await backup.path(),'utf8'));
    assert.equal(saved.settings['vp-circuit-presets421.v1'][0].name,'Guitar warmup');assert.equal(saved.settings['vp-circuit-presets421.v1'][0].steps[0].passes,2);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);
    await page.locator('#linkInput').fill('dQw4w9WgXcQ');await page.locator('#loadBtn').click();
    await page.locator('#circuit421').evaluate(e=>e.open=true);await page.locator('#circuitPresets421').evaluate(e=>e.open=true);
    await page.locator('#circuitPresetList421').getByRole('button',{name:'Load circuit preset: Guitar warmup',exact:true}).click();
    assert.equal(await page.locator('#circuitRows421 input').first().inputValue(),'2');assert.equal(await page.evaluate(()=>window.__vpCircuitActive421()),false);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-circuit-presets421.v1')).length),1);
    await page.locator('#linkInput').fill('dQw4w9WgXcQ');await page.locator('#loadBtn').click();
    await page.locator('#circuit421').evaluate(e=>e.open=true);await page.locator('#circuitPresets421').evaluate(e=>e.open=true);
    await page.locator('#circuitPresetList421').getByRole('button',{name:'Remove: Guitar warmup',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-circuit-presets421.v1')).length),0);
    await page.locator('#vpToast button').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('vp-circuit-presets421.v1')).length),1);
    await page.locator('#circuitPresetList421').getByRole('button',{name:'Load circuit preset: Guitar warmup',exact:true}).click();
    await page.locator('#circuitPresetName421').fill('guitar warmup');await page.locator('#circuitPresetSave421').click();assert.match(await page.locator('#circuitPresetStatus421').textContent(),/different/);
    await page.locator('#circuitPresets421').scrollIntoViewIfNeeded();if(await page.locator('#miniClose').isVisible())await page.locator('#miniClose').click();
    for(const lang of ['en','hi','gu']) {
      for(let i=0;i<3&&await page.locator('html').getAttribute('lang')!==lang;i++) await page.locator('#langBtn').click();
      await page.setViewportSize({width:390,height:844});
      const name=await page.locator('#circuitPresets421 > summary').textContent();console.log(lang,name);if(lang!=='en')assert.ok(!name.startsWith('Saved circuit'));
      await page.locator('#circuitPresets421').screenshot({path:'/downloads/421-presets-'+lang+'.png'});
    }
    assert.deepEqual(errors,[]);console.log('Circuit presets: save, backup export, fresh/repeat load, independent snapshots, load without playback, removal Undo and duplicate name rejection pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

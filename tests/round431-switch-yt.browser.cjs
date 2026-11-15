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
    await page.route('**/*', route => route.request().url().includes('youtube-nocookie.com/embed/') ? route.fulfill({contentType:'text/html',body:'<!doctype html><title>Test player</title>'}) : route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',1);
    await page.locator('#switchCard431').evaluate(e=>e.open=true);
    await page.locator('#switchRate431').selectOption('1000');
    const playerFrame=await (await page.locator('#frameBox iframe').elementHandle()).contentFrame();
    await playerFrame.evaluate(()=>{window.testCommands431=[];window.addEventListener('message',event=>{try{window.testCommands431.push(JSON.parse(event.data));}catch{}});});
    await page.locator('#switchStart431').click();await page.keyboard.press('Space');
    await playerFrame.waitForFunction(()=>window.testCommands431.some(m=>m.func==='pauseVideo'));
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent.includes('Back'),null,{timeout:2500});
    await page.keyboard.press('Space');await playerFrame.waitForFunction(()=>window.testCommands431.some(m=>m.func==='seekTo'&&m.args[0]===0));
    await page.locator('#switchStop431').click();
    await page.setViewportSize({width:390,height:844});
    for(const lang of ['en','hi','gu']){
      for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await page.locator('#langBtn').click();
      await page.locator('#switchStart431').click();
      await page.locator('#switchCard431').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
      await page.locator('#switchStop431').click();await page.locator('#switchStart431').click();
      await page.waitForFunction(()=>document.getElementById('playerDock').classList.contains('is-mini'));
      assert.ok(await page.locator('#switchCard431').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      assert.ok(await page.locator('#switchChoose431').isVisible());
      await page.waitForFunction(()=>{const g=document.querySelector('.switch-grid431').getBoundingClientRect(),v=document.getElementById('playerDock').getBoundingClientRect();return g.top>=v.bottom+12;});
      assert.ok(await page.locator('#switchChoose431').evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'the docked iframe must not intercept the Choose button');
      await page.locator('#switchStop431').click();
    }
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx');});
    await page.locator('#switchStart431').click();await page.keyboard.press('Space');await page.keyboard.press('Tab');
    assert.equal(await page.locator('.switch-cell431[data-current="true"]').count(),0);
    await page.locator('#switchChoose431').click();assert.equal(await page.locator('.switch-cell431[data-current="true"]').count(),1);
    await page.locator('#switchStop431').click();
    await page.locator('#switchCard431').evaluate(e=>e.open=false);await page.waitForFunction(()=>!document.documentElement.classList.contains('switch-open431'));
    assert.deepEqual(errors,[]);console.log('Single-switch YouTube simulated-message integration: play/pause and seek route correctly; docked player stays active, 390px three-language layout, dark/high-contrast/calm/low-effects controls pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

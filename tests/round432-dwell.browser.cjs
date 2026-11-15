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
    page.on('pageerror', e => {errors.push(e.message);console.error('PAGE',e.stack);});
    await page.route('**/*', route => route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    const samples=8000*60, wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
    await page.locator('#lpFile').setInputFiles([{name:'first.wav',mimeType:'audio/wav',buffer:wav},{name:'second.wav',mimeType:'audio/wav',buffer:wav}]);await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);
    await page.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=20;v.volume=.5;});
    await page.locator('#dwellCard432 > summary').click();
    await page.locator('#dwellTime432').selectOption('1000');
    const actions=page.locator('.dwell-action432');
    await page.locator('#dwellEnable432').click();
    assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'true');
    await actions.nth(5).hover();await page.waitForTimeout(1200);
    assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55);
    await page.waitForTimeout(1300);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55,'no repeated activation while resting');
    await page.mouse.move(0,0);await actions.nth(5).hover();await page.waitForTimeout(200);await page.mouse.move(0,0);await page.waitForTimeout(1000);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55,'leaving cancels');
    await actions.nth(5).click();await page.waitForTimeout(1200);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.6,'click must not be followed by a dwell duplicate');
    await page.mouse.move(0,0);await actions.nth(3).hover();await page.waitForTimeout(1200);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55);
    await actions.nth(4).hover();await page.waitForTimeout(1200);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.muted),true);
    await actions.nth(4).click();assert.equal(await page.locator('#lpVideo').evaluate(v=>v.muted),false);
    await page.locator('#dwellEnable432').click();assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'false');
    await actions.nth(5).hover();await page.waitForTimeout(1200);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55,'disabled dwell never activates');
    await actions.nth(2).click();assert.ok(await page.locator('#lpVideo').evaluate(v=>v.currentTime)>=29);
    await actions.nth(1).focus();await page.keyboard.press('Enter');assert.ok(await page.locator('#lpVideo').evaluate(v=>v.currentTime)<21);
    await actions.first().click();await page.waitForFunction(()=>!document.getElementById('lpVideo').paused);await actions.first().click();await page.waitForFunction(()=>document.getElementById('lpVideo').paused);
    await page.locator('#dwellEnable432').click();await actions.nth(5).hover();await page.waitForTimeout(200);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForTimeout(1100);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55);assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'false');
    await page.locator('#dwellEnable432').click();await actions.nth(5).hover();await page.waitForTimeout(200);await page.evaluate(()=>{let d=document.createElement('dialog');d.id='testModal';document.body.append(d);d.showModal();});await page.waitForTimeout(1100);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.55);await page.evaluate(()=>document.getElementById('testModal').remove());
    await page.locator('#dwellCard432 > summary').click();await page.waitForFunction(()=>document.getElementById('dwellEnable432').getAttribute('aria-pressed')==='false');
    await page.setViewportSize({width:390,height:844});await page.locator('#dwellCard432 > summary').click();
    for(const lang of ['en','hi','gu']){
      for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);
      assert.ok(await page.locator('#dwellCard432').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      if(lang!=='en')assert.ok(!(await page.locator('#dwellCard432 > summary').textContent()).includes('Pointer'));
      await page.locator('#dwellCard432').screenshot({path:'/downloads/432-dwell-local-'+lang+'.png'});
    }
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx');});
    await actions.nth(5).click();assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.6);
    await actions.nth(7).click();await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276==='second.wav');
    await actions.nth(6).click();await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276==='first.wav');
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'false');
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.locator('#dwellEnable432').getAttribute('aria-pressed'),'false');
    assert.deepEqual(errors,[]);console.log('Pointer rest: real local play/pause, seek, volume and mute; one-shot dwell, leave/click/modal/blur cancellation; Hindi/Gujarati at 390px, dark/high-contrast/calm/low-effects; fresh and repeat load pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

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
    // Load through the real form. Network media is intentionally blocked in this component test.
    assert.equal(await page.locator('#switchStart431').isDisabled(),true);
    // A real, self-contained 12-second PCM file. No network media or fixture download.
    const samples=8000*12, wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);for(let i=0;i<samples;i++)wav.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/8000)*1000),44+i*2);
    await page.locator('#lpFile').setInputFiles([{name:'first.wav',mimeType:'audio/wav',buffer:wav},{name:'second.wav',mimeType:'audio/wav',buffer:wav}]);await page.waitForFunction(()=>document.getElementById('lpVideo').readyState>=2);
    await page.locator('#lpVideo').evaluate(async v=>{await v.play();v.pause();v.volume=.8;});
    await page.locator('#switchCard431').evaluate(e=>e.open=true);
    assert.equal(await page.locator('#switchStart431').isEnabled(),true);
    await page.locator('.switch-instructions431 > summary').click();assert.equal(await page.locator('.switch-help431').isVisible(),true);await page.locator('.switch-instructions431 > summary').click();assert.equal(await page.locator('.switch-help431').isVisible(),false);
    await page.locator('#switchSpeak431').check();assert.equal(await page.locator('#switchSpeak431').isChecked(),true);
    await page.locator('#switchRate431').selectOption('1000');
    await page.locator('#switchStart431').click();
    assert.match(await page.locator('#switchChoose431').textContent(),/Choose: Play or pause/);
    assert.equal(await page.locator('#switchChoose431').evaluate(e=>document.activeElement===e),true);
    await page.keyboard.press('Space');await page.waitForFunction(()=>!document.getElementById('lpVideo').paused);
    await page.keyboard.press('Space');await page.waitForFunction(()=>document.getElementById('lpVideo').paused);
    await page.locator('#lpVideo').evaluate(v=>{v.currentTime=6;v.volume=.5;});
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent.includes('Back'),null,{timeout:2000});
    await page.keyboard.press('Space');assert.ok(await page.locator('#lpVideo').evaluate(v=>v.currentTime)<1);
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent.includes('Forward'),null,{timeout:2000});
    await page.keyboard.press('Space');assert.ok(await page.locator('#lpVideo').evaluate(v=>v.currentTime)>9);
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent==='Volume down',null,{timeout:2000});
    await page.keyboard.press('Space');assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.45);
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent==='Mute or unmute',null,{timeout:2000});
    await page.keyboard.press('Space');assert.equal(await page.locator('#lpVideo').evaluate(v=>v.muted),true);
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent==='Volume up',null,{timeout:2000});
    await page.keyboard.press('Space');assert.equal(await page.locator('#lpVideo').evaluate(v=>v.volume),.5);assert.equal(await page.locator('#lpVideo').evaluate(v=>v.muted),false);
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent==='Next file',null,{timeout:2000});
    await page.keyboard.press('Space');await page.waitForFunction(()=>document.getElementById('lpVideo').dataset.fileName276==='second.wav');
    await page.waitForFunction(()=>document.querySelector('.switch-cell431[data-current="true"]').textContent==='Pause scanning',null,{timeout:2000});
    await page.keyboard.press('Space');assert.equal(await page.locator('#switchChoose431').textContent(),'Resume scanning');
    await page.keyboard.press('Space');assert.match(await page.locator('#switchChoose431').textContent(),/Choose/);
    await page.keyboard.press('Tab');assert.equal(await page.locator('#switchChoose431').textContent(),'Resume scanning');
    await page.locator('#switchStop431').evaluate(e=>{window.switchStopText431=e.firstChild;});
    await page.locator('#switchStop431').focus();assert.equal(await page.locator('#switchStop431').evaluate(e=>e.firstChild===window.switchStopText431),true);
    await page.locator('#switchStop431').click();assert.equal(await page.locator('#switchChoose431').isDisabled(),true);
    await page.locator('#switchStart431').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#switchChoose431').isDisabled(),true);
    for(const lang of ['hi','gu']){await languageTap(page);assert.ok(!(await page.locator('#switchCard431 > summary').textContent()).includes('Single-switch'));await page.setViewportSize({width:390,height:844});await page.locator('#switchCard431').screenshot({path:'/downloads/431-switch-'+lang+'.png'});}
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.locator('#switchChoose431').isDisabled(),true);
    await page.reload();await page.waitForFunction(()=>window.__vpMainOk325);assert.equal(await page.locator('#switchChoose431').isDisabled(),true);
    assert.deepEqual(errors,[]);console.log('Single switch: real local play/pause, seek, volume, mute, next, pause/resume, focus-away, Escape, Hindi/Gujarati at 390px, fresh and repeat load pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

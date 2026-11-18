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
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().includes('youtube-nocookie.com/embed/') ? route.fulfill({contentType:'text/html',body:'<!doctype html><title>Test player</title>'}) : route.request().url().startsWith('http://localhost:8499') ? route.continue() : route.abort());
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-marks.v1',JSON.stringify({dQw4w9WgXcQ:[{name:'Final phrase',t:205},{name:'Beyond video',t:500}]}));localStorage.setItem('vp-practice-loops.v1', JSON.stringify({ dQw4w9WgXcQ: [{name:'Warmup',a:5,b:10},{name:'Chorus',a:20,b:30}] })); localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    const playerEvent=async(event,info)=>page.evaluate(({event,info})=>window.dispatchEvent(new MessageEvent('message',{source:document.querySelector('#frameBox iframe').contentWindow,origin:'https://www.youtube-nocookie.com',data:{event,info}})),{event,info});
    await playerEvent('onReady');await playerEvent('infoDelivery',{currentTime:0,duration:213});await playerEvent('onStateChange',1);
    await page.setViewportSize({width:390,height:844});
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
    await page.locator('#ctl-marks').evaluate(e=>e.open=true);await page.locator('#markAddBtn').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.getElementById('playerDock').classList.contains('is-mini'));
    await page.locator('#markAddBtn').evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));await page.locator('#markAddBtn').click();await page.locator('#vpAskBg').waitFor({state:'visible'});
    const visible=await page.locator('#vpAskBg .vp-ask-row button:last-child').evaluate(b=>{const r=b.getBoundingClientRect();return {top:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML.slice(0,150),clickable:b===document.elementFromPoint(r.x+r.width/2,r.y+r.height/2),popover:document.getElementById('vpAskBg').matches(':popover-open')};});
    console.log('Modal mini overlap:',visible);
    await page.screenshot({path:'/downloads/435-modal-'+(process.env.BEFORE?'before':'after')+'.png'});
    if(process.env.BEFORE){assert.equal(visible.clickable,false);await page.keyboard.press('Escape');return;}
    assert.equal(visible.clickable,true);assert.equal(visible.popover,true);
    assert.equal(await page.getByRole('dialog',{name:'Name this moment',exact:true}).count(),1);assert.equal(await page.getByRole('textbox',{name:'Name this moment',exact:true}).count(),1);
    await page.locator('#vpAskBg input').fill('A real moment');
    await page.keyboard.press('Tab');await page.keyboard.press('Tab');assert.equal(await page.locator('#vpAskBg .vp-ask-row button:last-child').evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Enter');await page.locator('#vpAskBg').waitFor({state:'detached'});
    assert.match(await page.locator('#markList').textContent(),/A real moment/);
    await playerEvent('infoDelivery',{currentTime:7,duration:213});
    // Cancel and Escape leave the original mini player alive; prompt focus returns to its opener.
    await page.locator('#markAddBtn').evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));await page.locator('#markAddBtn').click();await page.locator('#vpAskBg .vp-ask-row button:first-child').click();assert.equal(await page.locator('#vpAskBg').count(),0);
    await page.locator('#markAddBtn').evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));await page.locator('#markAddBtn').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#vpAskBg').count(),0);assert.equal(await page.locator('#markAddBtn').evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.locator('#playerDock').evaluate(e=>e.matches(':popover-open')),true);
    for(const lang of ['hi','gu']){
      for(let n=0;n<3&&await page.locator('html').getAttribute('lang')!==lang;n++)await languageTap(page);
      await page.locator('#markAddBtn').evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));await page.locator('#markAddBtn').click();const message=await page.locator('#vpAskMessage').textContent();assert.ok(message&&!message.includes('Name this moment'));
      assert.equal(await page.getByRole('dialog',{name:message,exact:true}).count(),1);assert.equal(await page.getByRole('textbox',{name:message,exact:true}).count(),1);
      await page.locator('#vpAskBg .vp-ask-row button:first-child').click();
    }

    assert.deepEqual(errors,[]);console.log('Dialog remains above the real mini-player popover; UI save, keyboard focus cycle, Cancel, Escape and focus restoration pass.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

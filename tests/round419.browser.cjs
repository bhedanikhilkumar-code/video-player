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
    await page.addInitScript(() => { if (location.hostname !== 'localhost') return; localStorage.setItem('vp-tour.v1', '1'); localStorage.setItem('vp-prefs.v1', JSON.stringify({ lang: 'en' })); });
    await page.goto('http://localhost:8499'); await page.waitForFunction(() => window.__vpMainOk325 === true);
    // Load through the real form. Network media is intentionally blocked in this component test.
    await page.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.locator('#loadBtn').click(); await page.locator('#controls').waitFor({ state: 'visible' });
    await page.locator('#swCard417').evaluate(e => e.open = true);
    await page.locator('#swGo417').click();
    for (let i = 0; i < 22; i++) await page.locator('#swLap417').click();
    assert.match(await page.locator('#swLaps417 li').first().getAttribute('aria-label'), /^Lap 22 /);
    assert.match(await page.locator('#swLaps417 li').last().getAttribute('aria-label'), /^Lap 3 /);
    assert.equal(await page.locator('#swLaps417 li').count(), 20);
    await page.locator('#swGo417').click(); await page.locator('#swReset417').click();
    await page.locator('#swGo417').click(); await page.locator('#swLap417').click();
    assert.match(await page.locator('#swLaps417 li').first().getAttribute('aria-label'), /^Lap 1 /);
    await page.locator('#swReset417').click();
    console.log('Stopwatch: 22 laps, bounded history and reset pass.');
    await page.locator('#intervalCard419').evaluate(e => e.open = true);
    await page.locator('#ivWork419').fill('4'); await page.locator('#ivGo419').click();
    assert.match(await page.locator('#ivError419').textContent(), /whole seconds/);
    assert.equal(await page.locator('#ivWork419').isDisabled(), false);
    for (const [id, value] of [['ivWork419', '5'], ['ivRest419', '3'], ['ivPrepare419', '2'], ['ivRounds419', '2']]) await page.locator('#' + id).fill(value);
    await page.clock.install(); await page.locator('#ivGo419').click();
    assert.equal(await page.locator('#ivStage419').textContent(), 'Get ready');
    assert.equal(await page.locator('#ivWork419').isDisabled(), true);
    await page.clock.fastForward(2100);
    assert.equal(await page.locator('#ivStage419').textContent(), 'Exercise · Round 1 / 2');
    await page.locator('#ivGo419').click(); const paused = await page.locator('#ivFace419').textContent();
    await page.clock.fastForward(15000); assert.equal(await page.locator('#ivFace419').textContent(), paused);
    assert.match(await page.locator('#ivStage419').textContent(), /Paused/);
    await page.locator('#ivSkip419').click(); assert.equal(await page.locator('#ivStage419').textContent(), 'Recovery · Round 1 / 2 · Paused');
    await page.locator('#ivGo419').click(); await page.clock.fastForward(3100);
    assert.equal(await page.locator('#ivStage419').textContent(), 'Exercise · Round 2 / 2');
    await page.clock.fastForward(5100); assert.equal(await page.locator('#ivStage419').textContent(), 'Intervals complete');
    assert.equal(await page.locator('#ivWork419').isDisabled(), false);
    assert.equal(await page.locator('#ivSkip419').isDisabled(), true);
    await page.locator('#ivReset419').click(); assert.equal(await page.locator('#ivStage419').textContent(), 'Ready');
    // No preparation, no rest, one round. Hidden-time catch-up must end once, not replay stages.
    await page.locator('#ivPrepare419').fill('0'); await page.locator('#ivRest419').fill('0'); await page.locator('#ivRounds419').fill('1');
    await page.locator('#ivGo419').click(); assert.equal(await page.locator('#ivStage419').textContent(), 'Exercise · Round 1 / 1');
    await page.clock.fastForward(60000); assert.equal(await page.locator('#ivStage419').textContent(), 'Intervals complete');
    await page.locator('#ivReset419').click();
    for (const value of ['1.5', '0', '100', '']) { await page.locator('#ivRounds419').fill(value); await page.locator('#ivGo419').click(); assert.match(await page.locator('#ivError419').textContent(), /whole seconds/); }
    await page.locator('#ivRounds419').fill('2'); await page.locator('#ivGo419').click();
    await page.locator('#ivSound419').uncheck(); await page.locator('#ivSound419').check();
    await page.setViewportSize({ width: 390, height: 844 });
    for (const lang of ['hi', 'gu', 'en']) {
      await languageTap(page);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('vp-prefs.v1')).lang), lang);
      assert.notEqual(await page.locator('#intervalCard419 summary').textContent(), '');
      const size = await page.locator('#intervalCard419').evaluate(e => ({ width: e.getBoundingClientRect().width, scroll: e.scrollWidth, client: e.clientWidth }));
      assert.ok(size.scroll <= size.client + 1, JSON.stringify(size));
      assert.equal(await page.locator('#ivWork419').isDisabled(), true);
      assert.notEqual(await page.locator('#ivStage419').textContent(), 'Ready');
      await page.locator('#intervalCard419').screenshot({path:'/tmp/vp419-interval-'+lang+'.png'});
    }
    await page.locator('#ivReset419').click();
    await page.evaluate(() => { document.documentElement.classList.add('high-contrast', 'low-fx', 'calm-motion'); });
    await page.locator('#ivGo419').click(); await page.locator('#ivSkip419').click();
    assert.equal(await page.locator('#ivStage419').textContent(), 'Exercise · Round 2 / 2');
    await page.locator('#ivReset419').click();
    assert.deepEqual(errors, []); console.log('Interval trainer: validation, phases, pause/resume, paused skip, finish, clock catch-up, no final rest, reset, sound toggle, three languages, 390px and low-effects/high-contrast pass.');
    await page.reload(); await page.waitForFunction(() => window.__vpMainOk325 === true);
    assert.equal(await page.locator('#ivStage419').textContent(), 'Ready');
    await page.reload(); await page.waitForFunction(() => window.__vpMainOk325 === true);
    assert.equal(await page.locator('#ivStage419').textContent(), 'Ready');
    console.log('Fresh and repeat load: session timer does not restart itself.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

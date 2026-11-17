// Run: node tests/round274.test.cjs. No dependencies. Source checks only; behaviour was tested in a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '../manifest.webmanifest'), 'utf8'));
assert.ok(html.includes('window.vpOpenFiles = function'), 'drop/open-with door');
assert.ok(html.includes('ok.length>1&&window.vpOpenFiles'), 'multi-file drop makes a playlist');
assert.ok(Array.isArray(man.file_handlers) && man.file_handlers[0].accept['video/mp4'] && man.file_handlers[0].accept['video/mp4'].includes('.mp4') && man.file_handlers[0].accept['audio/mpeg'].includes('.mp3'), 'file handlers');
assert.ok(html.includes('lq.setConsumer'), 'launch consumer');
assert.ok(html.includes('pad274') && html.includes('gamepadconnected'), 'game controller');
assert.ok(html.includes('if (raw && !/^[a-z][a-z0-9+.-]*:\\/\\//i.test(raw)) raw = "https://" + raw;'), 'playlist link without scheme');
assert.ok(html.includes('lpShotCopyBtn') && html.includes('new ClipboardItem'), 'copy frame');
assert.ok(html.includes('swp274'), 'swipe to remove');
assert.ok(html.includes('.help-card .actions{flex-wrap:wrap}'), 'help row wraps');
assert.ok(html.includes('k==="n"||k==="N"||k==="p"||k==="P"'), 'local N/P');
console.log('round274 ok');

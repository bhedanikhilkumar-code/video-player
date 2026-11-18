// Run: node tests/round274.test.cjs. No dependencies. Source checks only; behaviour was tested in a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '../manifest.webmanifest'), 'utf8'));
assert.ok(html.includes('window.vpOpenFiles = function'), 'drop/open-with door');
// Exercise the actual drop listener, including the single-file queue path added later.
const vm = require('node:vm');
const dropScript = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).find(s => s.includes('window.addEventListener("drop",function(e)') && s.includes('vpOpenFiles(ok)'));
assert.ok(dropScript, 'file drop handler exists');
const listeners = {}, opened = [], messages = [];
vm.runInNewContext(dropScript, { window: { T: s => s, addEventListener: (name, fn) => { listeners[name] = fn; }, vpOpenFiles: list => { opened.push(Array.from(list)); return true; }, toast: s => messages.push(s) }, document: {}, URL });
const first = {name:'one.mp4', type:'video/mp4', size:123}, second = {name:'two.mp3', type:'audio/mpeg', size:456}, invalid = {name:'notes.txt', type:'text/plain', size:9};
function drop(files) { let prevented = false; listeners.drop({dataTransfer:{types:['Files'], files}, preventDefault(){prevented = true;}}); assert.ok(prevented); }
drop([first, invalid, second]);
assert.deepEqual(opened.pop(), [first, second], 'multi-file drop makes a filtered playlist in order');
drop([first]);
assert.deepEqual(opened.pop(), [first], 'single file also enters the normal File queue');
drop([invalid]);
assert.equal(opened.length, 0, 'invalid files do not enter the queue');
assert.equal(messages.length, 1, 'invalid drop reports why it was rejected');
assert.ok(Array.isArray(man.file_handlers) && man.file_handlers[0].accept['video/mp4'] && man.file_handlers[0].accept['video/mp4'].includes('.mp4') && man.file_handlers[0].accept['audio/mpeg'].includes('.mp3'), 'file handlers');
assert.ok(html.includes('lq.setConsumer'), 'launch consumer');
assert.ok(html.includes('pad274') && html.includes('gamepadconnected'), 'game controller');
assert.ok(html.includes('if (raw && !/^[a-z][a-z0-9+.-]*:\\/\\//i.test(raw)) raw = "https://" + raw;'), 'playlist link without scheme');
assert.ok(html.includes('lpShotCopyBtn') && html.includes('new ClipboardItem'), 'copy frame');
assert.ok(html.includes('swp274'), 'swipe to remove');
assert.ok(html.includes('.help-card .actions{flex-wrap:wrap}'), 'help row wraps');
assert.ok(html.includes('k==="n"||k==="N"||k==="p"||k==="P"'), 'local N/P');
console.log('round274 ok');

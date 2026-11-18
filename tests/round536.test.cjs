const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const server = fs.readFileSync(path.join(__dirname, '../server/app.py'), 'utf8');

// Every script block parses, and the main boot flag is present.
let blocks = 0;
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) { blocks++; new vm.Script(m[1]); }
assert.equal(blocks, 79, 'all script blocks parse');
assert(html.indexOf('window.__vpMainOk325 = true') > 0, 'main flag');

// --- Round 536 new 1: MP3 quality choice ---
assert(server.includes('if q not in ("128", "192", "320"): raise Bad("bad_quality", "Invalid MP3 quality.")'), 'server validates quality');
assert(server.includes('"preferredquality": q'), 'server uses the picked quality');
assert(html.includes('bad_quality:'), 'client ERR entry for bad_quality');
assert(html.includes('id="dlMp3QRow536"'), 'quality row in the page');
assert(html.includes('function mp3QPaint536()'), 'chip painter exists');
assert(html.includes('if (kind === "mp3") body.quality = mp3Q536;'), 'single + queue bodies send quality');
assert((html.match(/if \(kind === "mp3"\) body\.quality = mp3Q536;/g) || []).length === 2, 'both single-download and queue-from-info send quality');
assert(html.includes('b536.quality = mp3Q536'), 'bulk queue sends quality');
assert(html.includes('"MP3 " + (it.body.quality || "192") + "k - "'), 'queue row names the bitrate');
assert(html.includes('localStorage.getItem("vp-dl-mp3q")'), 'choice persisted');
assert(html.includes('__vpWnew283("MP3 quality choice", "#dlMp3QRow536")'), "What's new entry");
const tr1 = html.match(/"MP3 quality choice": \[("[^"]+"), ("[^"]+")\]/);
assert(tr1, 'name translation row');
// Rows may be written as \uXXXX escapes in the source; decode before checking script.
const dec = (q) => JSON.parse(q);
assert(/[\u0900-\u097F]/.test(dec(tr1[1])), 'Hindi row');
assert(/[\u0A80-\u0AFF]/.test(dec(tr1[2])), 'Gujarati row');
const tr2 = html.match(/"That MP3 quality is not available\. Pick 128k, 192k or 320k\.": \[("[^"]+"), ("[^"]+")\]/);
assert(tr2, 'bad_quality translation row');

// --- Round 536 new 2: original-audio download ---
assert(server.includes('elif kind == "audio":'), 'server audio kind');
assert(html.includes('id="dlAudioBtn536"'), 'audio button in the page');
assert(html.includes('id="dlQAudioBtn536"'), 'queue audio button in the page');
assert(html.includes('download("audio")'), 'audio download wired');
assert(html.includes('qFromInfo("audio")'), 'audio queue wired');
assert(html.includes('kind === "audio" ? T("Audio - ")'), 'queue row label for audio');
assert(html.includes('kind === "audio" ? "Fetching the audio..."'), 'busy line for audio');
assert(html.includes('__vpWnew283("Original-audio download", "#dl")'), "What's new entry");
assert(html.includes('["#dlAudioBtn536", "Audio file (no conversion)"'), 'Hindi repaint table row');
assert(html.includes('"#dlAudioBtn536":'), 'Gujarati repaint table row');
const tr3 = html.match(/"Original-audio download": \[("[^"]+"), ("[^"]+")\]/);
assert(tr3, 'name translation row');
assert(/[\u0900-\u097F]/.test(dec(tr3[1])), 'Hindi row');
assert(/[\u0A80-\u0AFF]/.test(dec(tr3[2])), 'Gujarati row');

console.log('round536 tests pass');

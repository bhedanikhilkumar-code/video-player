// Run: node tests/round322.test.cjs. No dependencies.
// Round 322 new 1: passphrase-locked backups. The crypto helpers in index.html are
// DOM-free on purpose; this test lifts them out and runs a real lock/unlock round trip
// with Node's Web Crypto.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');
const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const a = html.indexOf('function vpLockB64e322'); const b = html.indexOf('// round 322 lock wiring (DOM)');
assert.ok(a > 0 && b > a, 'lock helpers must sit between their markers');
const ctx = vm.createContext({ crypto: require('crypto').webcrypto, TextEncoder, TextDecoder, btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), JSON, Promise, Error, Uint8Array, String, Array, Object });
vm.runInContext(html.slice(a, b), ctx);
(async () => {
  const backup = JSON.stringify({ queue: [{ id: 'abc', title: 't' }], favourites: [], playlists: [], settings: { 'vp-prefs.v1': {} } });
  const locked = await ctx.vpLockText322(backup, 'monsoon-2026');
  const w = JSON.parse(locked);
  assert.equal(w.vpLocked322, 1); assert.equal(w.kdf, 'PBKDF2-SHA256'); assert.equal(w.iter, 250000);
  assert.ok(w.salt.length > 10 && w.iv.length > 5 && w.data.length > 20);
  assert.ok(!locked.includes('abc') && !locked.includes('queue'), 'ciphertext must not leak the backup');
  assert.equal(await ctx.vpUnlockText322(locked, 'monsoon-2026'), backup, 'round trip');
  await assert.rejects(ctx.vpUnlockText322(locked, 'wrong-pass'), /bad-pass/, 'wrong passphrase must say so');
  await assert.rejects(ctx.vpLockText322('{"hello":1}', 'x'), /not-backup/, 'non-backup JSON refused');
  await assert.rejects(ctx.vpLockText322('not json', 'x'), /not-json/);
  await assert.rejects(ctx.vpUnlockText322(backup, 'x'), /not-locked/, 'plain backup refused by unlock');
  // a second lock of the same file must differ (fresh salt and IV)
  assert.notEqual(await ctx.vpLockText322(backup, 'monsoon-2026'), locked, 'fresh salt and IV per file');
  console.log('round322 new1 ok');
})().catch(e => { console.error(e); process.exit(1); });

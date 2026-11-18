// Distinct structural checks are named TAP subtests, never repeated to pad counts.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const exists = url => {
  const u = new URL(url, 'https://local.invalid/');
  if (u.origin !== 'https://local.invalid') return;
  const filename = decodeURIComponent(u.pathname) === '/' ? 'index.html' : decodeURIComponent(u.pathname).slice(1);
  assert.ok(fs.statSync(path.join(root, filename)).isFile(), url + ' resolves to a file');
};
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m => !/\bsrc\s*=|text\/plain|application\/ld\+json|application\/json/i.test(m[1]));
assert.ok(scripts.length > 0, 'inline scripts must be discovered');
scripts.forEach((m, i) => test(`inline JavaScript block ${i + 1} parses with node --check`, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vp-ci-syntax-'));
  try {
    const file = path.join(dir, /type\s*=\s*["']module["']/i.test(m[1]) ? 'script.mjs' : 'script.js');
    fs.writeFileSync(file, m[2]);
    execFileSync(process.execPath, ['--check', file], {stdio:'pipe'});
  } finally { fs.rmSync(dir, {recursive:true, force:true}); }
}));
test('service worker JavaScript syntax', () => new vm.Script(sw));
const localRefs = new Set();
for (const m of html.matchAll(/<(?:link|script|img|source)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
  if (!/^(?:https?:|data:|blob:|#|javascript:)/i.test(m[1])) localRefs.add(m[1]);
}
for (const url of localRefs) test(`HTML local asset exists: ${url}`, () => exists(url));
const refs = new Set();
for (const icon of manifest.icons) refs.add(icon.src);
for (const shortcut of manifest.shortcuts || []) {refs.add(shortcut.url); for (const icon of shortcut.icons || []) refs.add(icon.src);}
refs.add(manifest.start_url); refs.add(manifest.share_target.action);
for (const ref of refs) test(`manifest target exists: ${ref}`, () => exists(ref));
test('manifest has stable app identity and standalone scope', () => {
  assert.equal(manifest.id, '/'); assert.equal(manifest.scope, '/'); assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.name && manifest.short_name); assert.equal(manifest.lang,'en');
});
test('manifest provides regular and maskable install icons', () => {
  assert.ok(manifest.icons.some(i=>i.sizes==='192x192' && i.type==='image/png'));
  assert.ok(manifest.icons.some(i=>i.sizes==='512x512' && i.purpose==='maskable'));
});
test('manifest share target accepts links without POST uploads', () => {
  assert.equal(manifest.share_target.method, 'GET'); assert.equal(manifest.share_target.params.url, 'url');
});
const shell = sw.match(/var SHELL = (\[[^;]+\]);/);
assert.ok(shell, 'worker shell list is discoverable');
for (const ref of JSON.parse(shell[1])) test(`offline shell asset exists: ${ref}`, () => exists(ref));
test('service worker shell verifies responses before activating', () => {
  assert.match(sw, /SHELL\.map\(verifiedShellEntry\)/); assert.match(sw, /not-app/); assert.match(sw,/not-manifest/);
  assert.match(sw, /addEventListener\("install"/); assert.match(sw,/addEventListener\("activate"/); assert.match(sw,/addEventListener\("fetch"/);
});
test('package build includes only allowlisted distribution files, byte-for-byte', () => {
  execFileSync('npm',['run','build:package'], {cwd:root,stdio:'pipe'});
  const out = path.join(root,'dist','video-player');
  const info = JSON.parse(fs.readFileSync(path.join(out,'BUILD-INFO.json')));
  assert.equal(info.sourceCommit,execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim());
  const expected = [...info.files,'BUILD-INFO.json','README.md','package.json'].sort();
  assert.deepEqual(fs.readdirSync(out).sort(),expected);
  for(const file of info.files) assert.deepEqual(fs.readFileSync(path.join(out,file)),fs.readFileSync(path.join(root,file)),file);
  assert.ok(!expected.some(f=> /server|tests|\.git|node_modules/.test(f)));
  const pack = JSON.parse(execFileSync('npm',['pack','--dry-run','--json',out],{cwd:root,encoding:'utf8'}));
  assert.ok(pack[0].files.some(f=>f.path==='index.html'));
  assert.ok(!pack[0].files.some(f=> /(?:^|\/)(?:server|tests|\.git|node_modules)\//.test(f.path)));
});

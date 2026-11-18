import { mkdir, readFile, writeFile, copyFile, rm, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error('Use a stable semantic version');
const out = path.join(root, 'dist', 'video-player');
await rm(path.join(root, 'dist'), {recursive: true, force: true});
await mkdir(out, {recursive: true});
const required = ['index.html', 'sw.js', 'manifest.webmanifest', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
const included = [...required];
for (const file of ['_headers', '_redirects']) {
  try { await access(path.join(root, file)); included.push(file); } catch {}
}
// Exact allowlist: no recursive repository copy, server, tests, tokens or history.
for (const file of included) await copyFile(path.join(root, file), path.join(out, file));
const sha = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
const info = {name: pkg.name, version: pkg.version, sourceCommit: sha, files: included};
await writeFile(path.join(out, 'BUILD-INFO.json'), JSON.stringify(info, null, 2) + '\n');
const {scripts, ...published} = pkg;
await writeFile(path.join(out, 'package.json'), JSON.stringify(published, null, 2) + '\n');
await copyFile(path.join(root, 'PACKAGING.md'), path.join(out, 'README.md'));
// Refuse accidentally embedded credentials before creating distributable archives.
for (const file of [...included, 'package.json', 'README.md', 'BUILD-INFO.json']) {
  const text = await readFile(path.join(out, file), 'utf8');
  if (/github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) {
    throw new Error('Credential-like content in distribution: ' + file);
  }
}
console.log(JSON.stringify({out, version: pkg.version, sourceCommit: sha, files: included}, null, 2));

#!/usr/bin/env node
import {readFileSync, appendFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
export function releaseVersion(tag) {
  const m=/^v([1-9]\d*|0)\.([0-9])$/.exec(tag);
  if(!m) throw new Error('Expected a tenth-step tag such as v30.7');
  return `${m[1]}.${m[2]}.0`;
}
if(process.argv[1]===new URL(import.meta.url).pathname){
  const tag=process.argv[2],version=releaseVersion(tag);
  const pkg=JSON.parse(readFileSync('package.json','utf8'));
  if(pkg.version!==version)throw new Error(`Tag ${tag} requires package version ${version}`);
  const target=execFileSync('git',['rev-parse',`${tag}^{commit}`],{encoding:'utf8'}).trim();
  const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  if(target!==head)throw new Error('Checkout must match the requested tag');
  if(execFileSync('git',['cat-file','-t',tag],{encoding:'utf8'}).trim()!=='tag')throw new Error('Release requires an annotated signed tag');
  const object=execFileSync('git',['rev-parse',tag],{encoding:'utf8'}).trim();
  const verified=JSON.parse(execFileSync('gh',['api',`repos/${process.env.GITHUB_REPOSITORY}/git/tags/${object}`],{encoding:'utf8'}));
  if(verified.verification?.verified!==true||verified.object.sha!==target)throw new Error('Tag must be GitHub Verified');
  if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`tag=${tag}\nversion=${version}\ncommit=${target}\n`);
  console.log(JSON.stringify({tag,version,commit:target}));
}

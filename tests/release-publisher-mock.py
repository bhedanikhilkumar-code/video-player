import json,os,subprocess,tempfile,shutil
from pathlib import Path
source=Path(__file__).resolve().parents[1]/'scripts/publish-release.sh'
mock='''#!/usr/bin/env python3
import os,sys,json,shutil
from pathlib import Path
a=sys.argv[1:];name=Path(sys.argv[0]).name;state=Path(os.environ['MOCK_STATE']);d=json.loads(state.read_text());d['calls'].append([name,*a]);state.write_text(json.dumps(d))
def save():state.write_text(json.dumps(d))
if name=='node':
 if a[0]=='scripts/release-version.mjs':sys.exit(0)
 if a[0]=='-p':
  x=a[1]
  print(d.get('tag','v30.7')if '.tagName' in x else '30.7.0'if '.version' in x else '@bhedanikhilkumar-code/video-player');sys.exit(0)
if name=='git':print('1795564800');sys.exit(0)
if name=='npm':
 if a[:2]==['run','build:package']:
  p=Path('dist/video-player');p.mkdir(parents=True);(p/'index.html').write_text('source');sys.exit(0)
 if a[0]=='pack':
  if a[1].startswith('./dist'):(Path('dist')/'package.tgz').write_text('tarball')
  else:Path('registry.tgz').write_text('registry')
  sys.exit(0)
 if a[0]=='view':
  if d.get('autherror'):print('E401 unauthorized',file=sys.stderr);sys.exit(1)
  if d.get('published'):print('30.7.0');sys.exit(0)
  print('E404 package version missing',file=sys.stderr);sys.exit(1)
 if a[0]=='publish':d['published']=True;save();sys.exit(0)
if name=='tar':
 Path('package').mkdir();Path('package/index.html').write_text('corrupt'if d.get('corrupt')else 'source');sys.exit(0)
if name=='gh':
 if a[:2]==['release','view']:
  if not d.get('release'):print('release not found',file=sys.stderr);sys.exit(1)
  if '--jq' in a:print('true'if d['draft']else 'false')
  else:print(json.dumps({'tagName':'v30.7','isDraft':d['draft']}))
  sys.exit(0)
 if a[:2]==['release','create']:d.update(release=True,draft=True);save();sys.exit(0)
 if a[:2]==['release','download']:
  n=a[a.index('--pattern')+1]
  if n not in d.get('assets',{}):print('no matches',file=sys.stderr);sys.exit(1)
  Path(a[a.index('--dir')+1],n).write_bytes(bytes.fromhex(d['assets'][n]));sys.exit(0)
 if a[:2]==['release','upload']:
  f=Path(a[3]);d.setdefault('assets',{})[f.name]=f.read_bytes().hex();save();sys.exit(0)
 if a[:2]==['release','edit']:d['draft']=False;save();sys.exit(0)
print('unexpected mock call',name,a,file=sys.stderr);sys.exit(9)
'''
for case,config,success in [('fresh',{},True),('authfailure',{'autherror':True},False),('mismatch',{'corrupt':True},False)]:
 with tempfile.TemporaryDirectory()as tmp:
  p=Path(tmp);(p/'scripts').mkdir();shutil.copy(source,p/'scripts/publish-release.sh');b=p/'bin';b.mkdir()
  for name in ['node','git','npm','gh','tar']:(b/name).write_text(mock);(b/name).chmod(0o700)
  (p/'mock-state.json').write_text(json.dumps({'calls':[],**config}));env={**os.environ,'PATH':str(b)+':'+os.environ['PATH'],'VP_TAG':'v30.7','MOCK_STATE':str(p/'mock-state.json')}
  z=subprocess.run(['bash','scripts/publish-release.sh'],cwd=p,env=env,text=True,capture_output=True);d=json.loads((p/'mock-state.json').read_text());assert (z.returncode==0)==success,(case,z.stdout,z.stderr)
  if success:
   assert d['published']and not d['draft'];shutil.rmtree(p/'dist');z=subprocess.run(['bash','scripts/publish-release.sh'],cwd=p,env=env,text=True,capture_output=True);assert z.returncode==0,(z.stdout,z.stderr);d=json.loads((p/'mock-state.json').read_text());assert sum(a[:2]==['npm','publish']for a in d['calls'])==1;assert sum(a[:3]==['gh','release','create']for a in d['calls'])==1
  else:assert d['draft'] is True
  if config.get('autherror'):assert not any(a[:2]==['npm','publish']for a in d['calls'])
  print('PASS',case,'safe rerun'if success else 'release stays draft')

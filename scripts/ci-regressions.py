#!/usr/bin/env python3
"""Run every regression script in deterministic shards, preserving all failures."""
import argparse
import json
import os
import signal
from pathlib import Path
import subprocess
import sys
import time

p = argparse.ArgumentParser()
p.add_argument('kind', choices=['node', 'browser'])
p.add_argument('--shard', type=int, default=0)
p.add_argument('--shards', type=int, default=1)
a = p.parse_args()
if not 0 <= a.shard < a.shards:
    p.error('shard must be between zero and shards - 1')
files = sorted(Path('tests').glob('*.test.cjs' if a.kind == 'node' else '*.browser.cjs'))[a.shard::a.shards]
if not files:
    sys.exit('No tests selected')
out = Path('test-results') / f'{a.kind}-{a.shard}'
out.mkdir(parents=True, exist_ok=True)
results = []
for file in files:
    print(f'::group::{file}', flush=True)
    start = time.monotonic()
    try:
        r = subprocess.Popen(['node', str(file)], stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                             text=True, start_new_session=True)
        text, _ = r.communicate(timeout=120)
        code = r.returncode
    except subprocess.TimeoutExpired as e:
        # Kill Chrome children too; do not retain processes or ports after a timeout.
        os.killpg(r.pid, signal.SIGKILL)
        text, _ = r.communicate()
        code, text = 124, 'Test exceeded 120 seconds.\n' + text
    print(text, flush=True)
    (out / (file.name + '.log')).write_text(text)
    results.append({'file': str(file), 'exit_code': code, 'seconds': round(time.monotonic() - start, 2)})
    print('::endgroup::', flush=True)
    if code:
        print(f'::error file={file}::Regression failed (exit {code}); see log artifact', flush=True)
(out / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
passed = sum(r['exit_code'] == 0 for r in results)
summary = f'{a.kind} shard {a.shard}: {passed}/{len(results)} scripts passed; {len(results)-passed} failed.\n'
print(summary)
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as f:
        f.write('## ' + summary + '\n| Script | Result |\n|---|---|\n')
        for r in results:
            f.write(f"| `{r['file']}` | {'PASS' if not r['exit_code'] else 'FAIL'} |\n")
sys.exit(0 if passed == len(results) else 1)

"""Offline regression: guarded download followed by an accurate local media cut."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))
import app as b

@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'ffmpeg/ffprobe required')
class LocalTrimTests(unittest.TestCase):
    def test_cut_between_keyframes_keeps_video_and_audio(self):
        with tempfile.TemporaryDirectory() as root:
            fixture = os.path.join(root, 'fixture.mp4')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=blue:s=160x90:r=25', '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=44100', '-t', '2', '-c:v', 'libx264', '-g', '50', '-c:a', 'aac', fixture], check=True)
            class FakeDownloader:
                def __init__(self, opts): self.opts = opts
                def __enter__(self): return self
                def __exit__(self, *args): return False
                def extract_info(self, url, download):
                    assert 'download_ranges' not in self.opts
                    shutil.copyfile(fixture, self.opts['outtmpl'].replace('%(ext)s', 'mp4'))
                    return {'title': 'fixture', 'extractor_key': 'Fixture'}
            task = {'id': 'local-fixture'}
            with patch.object(b, 'WORK', root), patch.object(b, 'SafeYoutubeDL', FakeDownloader):
                b.do_download(task, {'url': 'unused-local-fixture', 'from': 0.2, 'to': 0.8})
            result = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type', '-show_entries', 'format=duration', '-of', 'json', os.path.join(task['dir'], task['file'])], text=True)
            info = json.loads(result)
            self.assertEqual({s['codec_type'] for s in info['streams']}, {'audio', 'video'})
            self.assertTrue(0.5 < float(info['format']['duration']) < 0.8)

if __name__ == '__main__': unittest.main()

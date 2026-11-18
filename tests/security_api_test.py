import os
import sys
import threading
import unittest
from unittest.mock import patch
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))
import app as b

class APISecurityTests(unittest.TestCase):
    def setUp(self):
        self.client = b.app.test_client()
        b.ADMISSIONS.clear()
        b.TASKS.clear()
        b.JOBS = threading.BoundedSemaphore(b.MAX_TASKS)

    def test_untrusted_origin_cannot_start_work(self):
        with patch.object(b, 'check_url') as validate:
            r = self.client.post('/tasks', json={'type': 'info', 'url': 'https://unit.invalid'}, headers={'Origin': 'https://other.invalid'})
            self.assertEqual(r.status_code, 403)
            self.assertNotIn('Access-Control-Allow-Origin', r.headers)
            validate.assert_not_called()

    def test_allowed_origin_and_no_store(self):
        for origin in [None, 'https://vp-player.pages.dev']:
            r = self.client.get('/health', headers={'Origin': origin} if origin else {})
            self.assertEqual(r.status_code, 200)
            self.assertEqual(r.headers['Cache-Control'], 'no-store')
            self.assertIn('Origin', r.headers['Vary'])
            self.assertEqual(r.headers['X-Content-Type-Options'], 'nosniff')
            if origin: self.assertEqual(r.headers['Access-Control-Allow-Origin'], origin)

    def test_json_arrays_and_malformed_urls_are_400_not_500(self):
        for data in [[1], True, {'type': 'info', 'url': 'http://['}, {'type': 'download', 'url': 'https://unit.invalid', 'from': 'NaN'}, {'type': 'download', 'url': 'https://unit.invalid', 'format': ';whoami'}]:
            self.assertEqual(self.client.post('/tasks', json=data).status_code, 400)

    def test_body_limit(self):
        r = self.client.post('/tasks', data='x' * (17 * 1024), content_type='application/json')
        self.assertEqual(r.status_code, 413)

    def test_rate_limit_before_dns_even_with_forged_forwarded_ip(self):
        with patch.object(b, 'check_url') as dns:
            for i in range(12):
                self.client.post('/tasks', json={}, headers={'X-Forwarded-For': str(i)})
            r = self.client.post('/tasks', json={'type': 'info', 'url': 'https://unit.invalid'})
            self.assertEqual(r.status_code, 429)
            self.assertEqual(r.headers['Retry-After'], '60')
            dns.assert_not_called()

    def test_sync_metadata_uses_shared_slots_and_releases_on_error(self):
        with patch.object(b, 'fetch_chapters', side_effect=ValueError('private filesystem path and credential')):
            r = self.client.get('/chapters?id=abcdefghijk')
        self.assertEqual(r.status_code, 400)
        self.assertNotIn('credential', r.get_data(as_text=True))
        self.assertTrue(b.JOBS.acquire(blocking=False))
        b.JOBS.release()
        for _ in range(b.MAX_TASKS): self.assertTrue(b.JOBS.acquire(blocking=False))
        self.assertEqual(self.client.get('/chapters?id=abcdefghijk').status_code, 429)

    def test_retained_task_limit_and_unguessable_capability(self):
        with patch.object(b, 'check_url', return_value='https://unit.invalid'), patch.object(threading.Thread, 'start'):
            for i in range(b.MAX_RETAINED): b.TASKS[str(i)] = {'status': 'done'}
            r = self.client.post('/tasks', json={'type': 'info', 'url': 'https://unit.invalid'})
            self.assertEqual(r.status_code, 400)
            b.TASKS.clear()
            r = self.client.post('/tasks', json={'type': 'info', 'url': 'https://unit.invalid'})
            self.assertEqual(r.status_code, 200)
            self.assertEqual(len(r.json['id']), 32)

    def test_task_error_is_generic_and_slot_is_released(self):
        b.JOBS.acquire()
        t = {'type': 'info'}
        with patch.object(b, 'do_info', side_effect=RuntimeError('private internal URL and secret')):
            b.run(t, None, {'url': 'unused'})
        self.assertNotIn('secret', t['error']['message'])
        self.assertEqual(t['status'], 'error')
        for _ in range(b.MAX_TASKS): self.assertTrue(b.JOBS.acquire(blocking=False))

if __name__ == '__main__': unittest.main()

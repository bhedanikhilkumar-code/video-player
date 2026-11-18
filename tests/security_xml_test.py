import io
import os
import sys
import unittest
from unittest.mock import patch

from defusedxml.common import DefusedXmlException
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))
import app


class PlaylistXMLTests(unittest.TestCase):
    def test_valid_atom_feed_is_preserved(self):
        feed = b'<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015"><title>Playlist</title><entry><yt:videoId>abcdefghijk</yt:videoId><title>Video</title></entry></feed>'
        with patch('urllib.request.urlopen', return_value=io.BytesIO(feed)):
            self.assertEqual(app.playlist_feed('valid_id'), ('Playlist', [{'id': 'abcdefghijk', 'title': 'Video'}]))

    def test_entity_expansion_is_rejected(self):
        feed = b'<!DOCTYPE feed [<!ENTITY bomb "expanded">]><feed><title>&bomb;</title></feed>'
        with patch('urllib.request.urlopen', return_value=io.BytesIO(feed)):
            with self.assertRaises(DefusedXmlException):
                app.playlist_feed('valid_id')

// Offline app shell is saved during install, before the first lost connection.
var CACHE = "vp-shell-v7";
var SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];
self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(SHELL); }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k.indexOf("vp-shell-") === 0 && k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Downloads and external videos are never cached by this worker.
  var shell = req.mode === "navigate" || SHELL.indexOf(url.pathname) >= 0;
  if (!shell) return;
  e.respondWith(fetch(req).then(function(res) {
    if (res.ok) {
      var copy = res.clone();
      e.waitUntil(caches.open(CACHE).then(function(c) { return c.put(req.mode === "navigate" ? "/" : url.pathname, copy); }));
    }
    return res;
  }).catch(function() {
    return caches.match(req.mode === "navigate" ? "/" : url.pathname).then(function(res) {
      if (res) return res;
      if (req.mode !== "navigate") return Response.error();
      return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You are offline | Video Player</title><body style="font:18px system-ui;padding:32px;max-width:560px;margin:auto"><h1>You are offline</h1><p>Connect to the internet and reopen Video Player once to save the app for offline use. Videos need an internet connection. Your saved library is still on this device.</p><p><a href="/">Try again</a></p></body></html>', {headers: {"Content-Type":"text/html; charset=utf-8"}});
    });
  }));
});

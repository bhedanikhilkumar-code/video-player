// Network first for the page so updates show up at once; cached copy is used when offline.
var CACHE = "vp-shell-v4";
self.addEventListener("install", function (e) { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok && (req.mode === "navigate" || url.pathname === "/" || /\.(webmanifest|js|css)$/.test(url.pathname))) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req.mode === "navigate" ? "/" : req, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(req.mode === "navigate" ? "/" : req).then(function (r) { return r || Response.error(); });
  }));
});



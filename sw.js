// Offline app shell is saved during install, before the first lost connection.
var CACHE = "vp-shell-v12";
var SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];
self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(SHELL); }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k.indexOf("vp-shell-") === 0 && k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});
// Offline library thumbnails (round 287): the app shell already opens offline, but every
// library row lost its picture without a connection. YouTube thumbnails the library has
// shown once now save themselves on the device (newest 400 kept) and the saved copy serves
// when the network is down or slow, so the queue, Watch later and history still look
// complete offline. Only thumbnails are cached this way - never videos or pages.
var THUMBS = "vp-thumbs-v1", THUMB_MAX = 400;
self.addEventListener("fetch", function(e) {
  var req = e.request, url = new URL(req.url);
  if (req.method === "GET" && req.cache !== "reload" && /^(i\d*\.ytimg\.com|img\.youtube\.com)$/.test(url.hostname)) {
    e.respondWith(caches.open(THUMBS).catch(function() { return null; }).then(function(cache) {
      if (!cache) return fetch(req).catch(function() { return Response.error(); });
      return cache.match(req).then(function(hit) {
        var net = fetch(req).then(function(res) {
          if (!res || !(res.ok || res.type === "opaque")) return res;
          // A cache write is an optimisation, never a reason to hide a good image.
          return cache.put(req, res.clone()).then(function() {
            return cache.keys().then(function(keys) {
              return Promise.all(keys.slice(0, Math.max(0, keys.length - THUMB_MAX)).map(function(key) { return cache.delete(key); }));
            });
          }).then(function() { return res; }, function() { return res; });
        });
        // On a cache hit respondWith resolves immediately. Keep the refresh alive and
        // consume a failed offline fetch instead of leaking an unhandled rejection.
        e.waitUntil(net.then(function() {}, function() {}));
        return hit || net.catch(function() { return Response.error(); });
      });
    }));
    return;
  }
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Downloads and external videos are never cached by this worker.
  var shell = req.mode === "navigate" || SHELL.indexOf(url.pathname) >= 0;
  if (!shell) return;
  // Network first, but a connection that is "up" and stalled (lie-fi) must not freeze the
  // app: after 4 seconds a page load falls back to the saved copy while the network request
  // keeps going and refreshes the cache for next time.
  var key = req.mode === "navigate" ? "/" : url.pathname;
  var net = fetch(req).then(function(res) {
    if (res.ok) {
      var copy = res.clone();
      e.waitUntil(caches.open(CACHE).then(function(c) { return c.put(key, copy); }));
    }
    // HTTP failures are still resolved fetches. A saved app must win over a temporary
    // 404/5xx page just as it wins over a disconnected network. Never cache the error.
    if (!res.ok) return caches.open(CACHE).then(function(c) { return c.match(key); }).then(function(hit) { return hit || res; });
    return res;
  });
  e.waitUntil(net.catch(function() {}));
  e.respondWith(new Promise(function(resolve) {
    var settled = false, timer = null;
    function done(r) { if (settled) return; settled = true; clearTimeout(timer); resolve(r); }
    if (req.mode === "navigate") timer = setTimeout(function() {
      caches.match(key).then(function(r) { if (r) done(r); });
    }, 4000);
    net.then(done, function() {
      if (settled) return;
      caches.match(key).then(function(res) {
        if (res) return done(res);
        if (req.mode !== "navigate") return done(Response.error());
        done(new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You are offline | Video Player</title><body style="font:18px system-ui;padding:32px;max-width:560px;margin:auto"><h1>You are offline</h1><p>Connect to the internet and reopen Video Player once to save the app for offline use. Videos need an internet connection. Your saved library is still on this device.</p><p><a href="/">Try again</a></p></body></html>', {headers: {"Content-Type":"text/html; charset=utf-8"}}));
      });
    });
  }));
});

// Round 342: inspect/repair only this worker's six app-shell files. Lists and notes
// live elsewhere and are never read or changed. Install is still the normal route;
// this explicit repair is for a copy the browser partly evicted or a failed refresh.
self.addEventListener("message", function(e) {
  if (!e.data || ["VP_OFFLINE_STATUS342", "VP_OFFLINE_REPAIR342"].indexOf(e.data.type) < 0 || !e.ports || !e.ports[0]) return;
  var port = e.ports[0];
  function answer(x) { try { port.postMessage(x); } catch(ignore) {} }
  async function status() {
    var cache = await caches.open(CACHE), files = [];
    for (var path of SHELL) {
      var r = await cache.match(path);
      files.push({path:path, saved:!!(r && r.ok)});
    }
    return {ok:true, cache:CACHE, files:files};
  }
  e.waitUntil((async function() {
    if (e.data.type === "VP_OFFLINE_STATUS342") return answer(await status());
    var entries;
    try {
      entries = await Promise.all(SHELL.map(async function(path) {
        var ac = new AbortController(), timer = setTimeout(function() { ac.abort(); }, 10000);
        try {
          var r = await fetch(new Request(new URL(path, location.origin), {cache:"no-store", credentials:"same-origin", signal:ac.signal}));
          if (!r.ok) throw Error("http");
          var mime = r.headers.get("content-type") || "";
          if (path === "/") {
            var text = await r.clone().text();
            if (!/text\/html/i.test(mime) || text.indexOf("window.__vpMainOk325 = true") < 0) throw Error("not-app");
          } else if (path.endsWith(".webmanifest")) {
            var manifest = await r.clone().json(); if (!manifest.name || !manifest.icons) throw Error("not-manifest");
          } else if (!/^image\//i.test(mime)) throw Error("not-image");
          return {path:path, response:r};
        } finally { clearTimeout(timer); }
      }));
    } catch(err) { return answer({ok:false,error:"network"}); }
    try {
      var cache = await caches.open(CACHE), done = 0;
      // Write the page LAST. A failed download or quota failure keeps the old usable
      // page rather than deleting it first and leaving the device with no offline app.
      var ordered = entries.filter(function(x) { return x.path !== "/"; }).concat(entries.filter(function(x) { return x.path === "/"; }));
      for (var item of ordered) {
        await cache.put(item.path, item.response);
        answer({progress:++done,total:SHELL.length});
      }
      answer(await status());
    } catch(err) { answer({ok:false,error:"storage"}); }
  })().catch(function() { answer({ok:false,error:"storage"}); }));
});

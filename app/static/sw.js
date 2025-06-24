// app/static/sw.js
const CACHE_VERSION = 'v3';
const CACHE_NAME = `connect-atx-elite-${CACHE_VERSION}`;

// Statically precache the shell and key assets
const PRECACHE_URLS = [
  '/', // HTML shell
  '/static/tailwind.min.css', // CSS bundle
  '/static/js/bundle.min.js', // JS bundle
  '/static/logo.png',
  '/static/connect-atx-team.jpg',
  '/static/favicon.ico',
  '/offline.html', // Fallback page
];

// Install → precache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activate → cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((old) => caches.delete(old))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch → Cache-first for static, network-first for navigation, fallback to offline.html
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Always let analytics or external requests go to network
  if (url.origin !== self.location.origin) {
    return;
  }

  // HTML pages: network-first, fallback to cache → offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Static assets (CSS/JS/Images): cache-first
  if (/\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((networkRes) => {
            // Cache new static assets
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return networkRes;
          })
      )
    );
    return;
  }

  // Fallback for other GET requests
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

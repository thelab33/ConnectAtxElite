const CACHE_NAME = 'connect-atx-elite-v1';
const PRECACHE_URLS = [
  '/', // Cache the root page
  '/static/css/globals.css',
  '/static/css/header.css',
  '/static/js/main.js',
  '/static/images/logo-atx-elite.png',
  '/static/images/connect-atx-team.jpg',
  // Add other key assets here...
];

self.addEventListener('install', event => {
  // Precache key assets
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Try cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // Cache the new response for future requests (optional)
        if (
          response.status === 200 &&
          event.request.method === 'GET' &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback: You can return a fallback page or image here
        if (event.request.destination === 'document') {
          return caches.match('/offline.html'); // Make sure to precache offline.html
        }
      });
    })
  );
});

console.log('⚡ Connect ATX Elite Service Worker registered and enhanced.');

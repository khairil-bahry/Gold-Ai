// RiL Gold AI — service worker
// Bump CACHE_VERSION on every deploy so old clients pick up the new build.
const CACHE_VERSION = 'rilgoldai-v1';
const CACHE_NAME = `rilgoldai-cache-${CACHE_VERSION}`;

// Core app-shell files hosted on our own origin.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

// Third-party CDN scripts the app depends on (React/Babel/etc). Cached
// opportunistically as they're fetched (see fetch handler below) rather
// than pre-cached here, since exact CDN URLs/versions live in index.html.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('rilgoldai-cache-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = req.mode === 'navigate';

  // The HTML document itself: network-first, so online users always see the
  // latest deployed version. Falls back to the cached shell when offline.
  if (isSameOrigin && (isNavigation || url.pathname.endsWith('/index.html'))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else (same-origin icons/manifest, or third-party CDN assets
  // like React/Babel/Tailwind/Lucide/fonts): cache-first, refresh in the
  // background so repeat visits stay fast and mostly work offline.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

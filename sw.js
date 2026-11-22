/*
 * Test Mardollo PWA — Service Worker
 * Copyright (C) 2026 TestMardollo
 * License: GNU Affero General Public License v3.0 (AGPL-3.0)
 */

const CACHE_NAME = 'test-mardollo-v1.0.0';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(LOCAL_ASSETS);
      // Carica le librerie CDN in cache senza bloccare l'installazione se momentaneamente offline
      await Promise.allSettled(
        CDN_ASSETS.map(async (url) => {
          const req = new Request(url, { mode: 'cors' });
          const res = await fetch(req);
          if (res.ok) await cache.put(url, res);
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
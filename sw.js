// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

var CACHE_NAME = 'v1';
var urlsToCache = [
    'https://ethanwadsworth.github.io/Lab7/',
    'https://ethanwadsworth.github.io/Lab7/scripts/router.js',
    'https://ethanwadsworth.github.io/Lab7/scripts/script.js',
    'https://ethanwadsworth.github.io/Lab7/sw.js',
    'https://ethanwadsworth.github.io/Lab7/settings.svg',
    'https://ethanwadsworth.github.io/Lab7/style.css',
    'https://ethanwadsworth.github.io/Lab7/components/entry-page.js',
    'https://ethanwadsworth.github.io/Lab7/components/journal-entry.js',
    'https://cse110lab6.herokuapp.com/entries'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            return response || fetch(event.request);
        }
        )
    );
});
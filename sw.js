// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

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

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
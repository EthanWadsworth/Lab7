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

// self.addEventListener('fetch', function(event) {
//     console.log(event.request.url);
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(response) {
//             return response || fetch(event.request)
//         }
//         )
//     );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       }
//     )
//   );
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((resp) => {
//         return resp || fetch(event.request).then((response) => {
//           return caches.open('v1').then((cache) => {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         });
//       })
//     );
// });

console.log("here");
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log("response is: ", response);
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log("response here is: ", response);
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            console.log("got to end");
            return response;
          }
        );
      })
    );
});
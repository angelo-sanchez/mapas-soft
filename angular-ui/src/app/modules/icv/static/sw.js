// importScripts('//cdn.jsdelivr.net/npm/serviceworker-cache-polyfill@4.0.0/index.min.js');

/*
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('icv').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/scales.js'
     ]);
   })
 );
});
*/

this.addEventListener('install', function(event) {
    console.log('Installing Service Worker');
    event.waitUntil(this.skipWaiting());
});

this.addEventListener('activate', function(event) {
    event.waitUntil(this.clients.claim());
});

this.addEventListener('fetch', function(event) {
    var url = event.request.url;

    if (url.startsWith('https://') && (url.includes('000webhostapp.com') || url.includes('ign.gob.ar') || url.includes('arcgis.com') || url.includes('here.com') || url.includes('conicet.gov.ar') || url.includes('api.maptiler.com'))) {
        event.respondWith(
            caches.match(event.request).then(function(resp) {
                return resp || fetch(event.request).then(function(response) {
                    var cacheResponse = response.clone();
                    caches.open('icv').then(function(cache) {
                        cache.put(event.request, cacheResponse);
                    });
                    return response;
                });
            })
        );
    }
});


const urlsToCache = [
    './',
    './index.html',
    './index.js',
    './style.css',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open("PNR Status")
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                return res || fetch(e.request);
            })
            .catch(err =>{
                console.log(err)
            })
    );
});

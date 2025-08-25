
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
});

self.addEventListener('fetch', (event) => {

  if (event.request.url.includes('/api/')) {
   
    return;
  }

  event.respondWith(fetch(event.request));
});
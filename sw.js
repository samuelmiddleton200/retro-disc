const CACHE = 'retro-disc-202610071859';
const APP = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP.map(u => new Request(u, { cache:'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const own = new URL(e.request.url).origin === location.origin;
  e.respondWith(caches.open(CACHE).then(async c => {
    try {
      const r = await fetch(own ? new Request(e.request, { cache:'no-store' }) : e.request);
      if (r.ok || r.type === 'opaque') c.put(e.request, r.clone());
      return r;
    } catch { return (await c.match(e.request)) || (await c.match('./')) || Response.error(); }   // offline
  }));
});

// TALMUT — service worker: permite abrir la app sin conexión (marcador, historial, instrucciones).
// El modo online siempre va a la red.
const CACHE = 'talmut-v6';
const SHELL = ['./', './index.html', './manifest.json', './privacy.html', './icon-192.png', './icon-256.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(SHELL.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return; // juego online: nunca desde caché
  if (url.pathname.endsWith('.mp3')) return; // música: directa (peticiones por rangos)
  if (req.mode === 'navigate') {
    // HTML: primero la red (para recibir actualizaciones), si falla, la copia guardada
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok && (url.origin === location.origin || url.hostname.includes('fonts') || url.hostname.includes('jsdelivr'))) {
      const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return r;
  })));
});

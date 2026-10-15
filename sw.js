// Service worker sederhana: menyimpan "kerangka" aplikasi agar tetap terbuka saat sinyal jelek.
// Data listrik (Firebase) TIDAK disimpan, selalu diambil langsung.
const CACHE = "wattwise-v1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // biarkan Firebase lewat langsung
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});

/* Service worker de Mesh PR: deja la página y las guías disponibles sin conexión.
   - Archivos del sitio (index.html, .md, manifest, íconos): red primero; si no hay red
     o tarda más de 3 s, se usa la copia guardada.
   - Librerías y fuentes de CDN: copia guardada primero, se actualiza por detrás.
   - API de GitHub: no se intercepta.
   Sube VERSION si cambias la lista CORE o la lógica de este archivo. */
const VERSION = "v2";
const CACHE = "meshpr-" + VERSION;
const CORE = [
  "./",
  "index.html",
  "favicon.svg",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "apple-touch-icon.png",
  "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js",
  "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"
];
const NETWORK_TIMEOUT = 3000;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("meshpr-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* La página manda la lista de guías para guardarlas desde la primera visita. */
self.addEventListener("message", (e) => {
  const data = e.data || {};
  if (data.type !== "cache-urls" || !Array.isArray(data.urls)) return;
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(data.urls.map((u) => c.add(u).catch(() => {}))))
  );
});

function networkFirst(req) {
  return caches.open(CACHE).then((cache) => {
    const network = fetch(req).then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    return cache.match(req, { ignoreSearch: true }).then((cached) => {
      if (!cached) {
        return network.catch(() =>
          req.mode === "navigate" ? cache.match("./").then((r) => r || cache.match("index.html")) : Promise.reject(new Error("offline"))
        );
      }
      const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NETWORK_TIMEOUT));
      return Promise.race([network.catch(() => cached), timeout]);
    });
  });
}

function cacheFirst(req) {
  return caches.open(CACHE).then((cache) =>
    cache.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") cache.put(req, res.clone());
        return res;
      });
      if (cached) { network.catch(() => {}); return cached; }
      return network;
    })
  );
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "api.github.com") return;
  if (url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  if (/^(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(cacheFirst(req));
  }
});

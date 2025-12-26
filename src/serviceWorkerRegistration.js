// // src/serviceWorkerRegistration.js

// export function register() {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js');
//     });
//   }
// }

// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.unregister();
//     });
//   }
// }


const CACHE_NAME = "pwa-cache-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json"
];

// 🔹 INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// 🔹 ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 🔹 FETCH (THIS IS THE IMPORTANT PART)
self.addEventListener("fetch", (event) => {

  // ✅ SPA navigation → always return index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // ✅ Static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

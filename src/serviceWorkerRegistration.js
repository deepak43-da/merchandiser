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

// const CACHE_NAME = "pwa-cache-v1";

// const APP_SHELL = [
//   "/",
//   "/index.html",
//   "/manifest.json"
// ];

// // 🔹 INSTALL
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(APP_SHELL);
//     })
//   );
//   self.skipWaiting();
// });

// // 🔹 ACTIVATE
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys
//           .filter((key) => key !== CACHE_NAME)
//           .map((key) => caches.delete(key))
//       )
//     )
//   );
//   self.clients.claim();
// });

// // 🔹 FETCH (THIS IS THE IMPORTANT PART)
// self.addEventListener("fetch", (event) => {

//   // ✅ SPA navigation → always return index.html
//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       caches.match("/index.html").then((cached) => {
//         return cached || fetch(event.request);
//       })
//     );
//     return;
//   }

//   // ✅ Static assets
//   event.respondWith(
//     caches.match(event.request).then((cached) => {
//       return cached || fetch(event.request);
//     })
//   );
// });

const CACHE_NAME = "pwa-cache-v1";
const CLEANUP_KEY = "last_data_cleanup_timestamp";

const APP_SHELL = ["/", "/index.html", "/manifest.json"];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate with cleanup
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
          )
        ),
      // Check for cleanup every 5 minutes
      (async () => {
        const lastCleanup = localStorage.getItem(CLEANUP_KEY);
        const now = new Date();
        const fiveMinutesInMs = 5 * 60 * 1000;
        if (!lastCleanup || now - new Date(lastCleanup) > fiveMinutesInMs) {
          // Clear IndexedDB (Redux store)
          if (window.indexedDB) {
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
              if (db.name) {
                window.indexedDB.deleteDatabase(db.name);
              }
            }
          }
          // Clear localStorage items
          localStorage.removeItem("auth");
          localStorage.removeItem("id");
          localStorage.removeItem("maindata");
          // Update cleanup timestamp
          localStorage.setItem(CLEANUP_KEY, now.toISOString());
        }
      })(),
    ])
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  // SPA navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // Static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

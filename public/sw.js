const CACHE_NAME = 'he2b-student-card-v2.0.0';
const API_CACHE = 'he2b-api-cache-v2.0.0';

// Ressources à mettre en cache au premier chargement
const STATIC_RESOURCES = [
    '/',
    '/Logo-esi.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json'
];

// ===== INSTALLATION =====
self.addEventListener('install', (event) => {
    console.log('[SW] Installation...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Mise en cache des ressources statiques');
            return cache.addAll(STATIC_RESOURCES);
        })
    );

    // Activer immédiatement le nouveau service worker
    self.skipWaiting();
});

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
    console.log('[SW] Activation...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprimer les anciens caches
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
                        console.log('[SW] Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Prendre le contrôle immédiatement
    self.clients.claim();
});

// ===== FETCH (stratégie de cache) =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // ===== STRATÉGIE POUR LES API =====
    if (url.pathname.startsWith('/api/v1/cards/students/')) {
        event.respondWith(
            // Network First, puis Cache
            fetch(request)
                .then((response) => {
                    // Mettre en cache la réponse
                    const responseClone = response.clone();
                    caches.open(API_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Si offline, utiliser le cache
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log('[SW] Mode offline - utilisation du cache');
                            return cachedResponse;
                        }
                        // Fallback si pas de cache
                        return new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'Vous êtes hors ligne. Les données en cache ne sont pas disponibles.'
                            }),
                            {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    // ===== STRATÉGIE POUR LES RESSOURCES STATIQUES =====
    event.respondWith(
        // Cache First, puis Network
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                // Ne pas mettre en cache les erreurs
                if (!response || response.status !== 200) {
                    return response;
                }

                // Mettre en cache les nouvelles ressources
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });

                return response;
            });
        })
    );
});

// ===== MESSAGES =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('[SW] Service Worker chargé ✓');
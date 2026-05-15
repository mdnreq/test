const CACHE_NAME = 'municipal-dao-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/governance',
  '/governance/town-hall',
  '/governance/calendar',
  '/governance/reputation',
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API requests - always go to network
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(async () => {
        // Try to get from cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's a navigation request, show offline page
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Return a basic offline response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body || 'New notification from Municipal DAO',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Municipal DAO', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-votes') {
    event.waitUntil(syncOfflineVotes());
  }
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncOfflineComments());
  }
});

async function syncOfflineVotes() {
  // Get queued votes from IndexedDB and sync them
  console.log('[SW] Syncing offline votes');
}

async function syncOfflineComments() {
  // Get queued comments from IndexedDB and sync them
  console.log('[SW] Syncing offline comments');
}

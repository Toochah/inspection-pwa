/**
 * Service Worker для PWA "Склад.Инспект"
 */

const CACHE_NAME = 'warehouse-inspect-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/data.js',
    '/manifest.json',
    '/offline.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'
];

// Установка
self.addEventListener('install', (event) => {
    console.log('[SW] Установка');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Кэширование');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[SW] Ошибка кэширования:', error);
            })
    );
});

// Активация
self.addEventListener('activate', (event) => {
    console.log('[SW] Активация');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Удаление старого кэша:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Возвращаем из кэша, обновляем в фоне
                    fetchAndCache(event.request);
                    return cachedResponse;
                }
                return fetchAndCache(event.request);
            })
            .catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match(OFFLINE_URL);
                }
                return new Response('Offline', { status: 503 });
            })
    );
});

async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        throw error;
    }
}

// Фоновая синхронизация
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-reports') {
        event.waitUntil(syncReports());
    }
    if (event.tag === 'sync-defects') {
        event.waitUntil(syncDefects());
    }
});

async function syncReports() {
    console.log('[SW] Синхронизация отчётов...');
    try {
        await fetch('/api/sync/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('[SW] Отчёты синхронизированы');
    } catch (error) {
        console.error('[SW] Ошибка синхронизации:', error);
    }
}

async function syncDefects() {
    console.log('[SW] Синхронизация дефектов...');
    try {
        await fetch('/api/sync/defects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('[SW] Дефекты синхронизированы');
    } catch (error) {
        console.error('[SW] Ошибка синхронизации:', error);
    }
}

// Push уведомления
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Склад.Инспект';
    
    const options = {
        body: data.body || 'Новое уведомление',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: data,
        actions: [
            { action: 'view', title: 'Посмотреть' },
            { action: 'dismiss', title: 'Закрыть' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Клик по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes('/index.html') && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/index.html');
                }
            })
    );
});

// Сообщения от клиента
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker загружен');
/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

// Предварительное кэширование файлов
precacheAndRoute(self.__WB_MANIFEST || []);

// Кэширование API-запросов
registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === 'image',
  new NetworkFirst({
    cacheName: 'api-cache',
  })
);

// Удаление старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'api-cache') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('api-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      });
    })
  );
});

// Экспортируйте функцию регистрации
export const register = (config) => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const registration = navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        if (reg && reg.waiting) {
          // Если есть ожидающий сервисный работник, обновляем
          if (config && config.onUpdate) {
            config.onUpdate(reg);
          }
        }
      });

      registration.catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });
    });
  }
};

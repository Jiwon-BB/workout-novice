// 자동 생성 — build-site.py. 직접 고치지 말 것.
const CACHE = 'workout-20260901-0114';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  // 새 버전을 받으면 곧바로 활성화한다. 사용자가 탭을 모두 닫을 때까지 기다리지 않는다.
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  // 이전 버전 캐시를 지운다. 이걸 안 하면 옛 앱이 영원히 남는다.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // 네트워크 우선, 실패하면 캐시. 헬스장에서 신호가 없어도 열리고,
  // 신호가 있으면 항상 최신을 받는다.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match('./index.html')))
  );
});

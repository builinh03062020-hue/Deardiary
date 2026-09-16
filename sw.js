// ĐỊNH DANH BỘ NHỚ ĐỆM CHO TIẾN TRÌNH NGOẠI TUYẾN
const CACHE_NAME = 'vintage-diary-cache-v1';

// KHAI BÁO CÁC TÀI NGUYÊN TĨNH BẮT BUỘC PHẢI LƯU TRỮ TRƯỚC
const urlsToCache = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Segoe+UI:wght@400;600&display=swap',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
];

// Sự kiện Cài đặt: Tải trước tài nguyên vào bộ nhớ đệm (Pre-caching)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Đã khởi tạo Cache tĩnh.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện Tìm nạp: Chiến lược Stale-While-Revalidate
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ưu tiên trả về dữ liệu từ Cache nếu có
        if (response) {
          return response;
        }
        // Fallback: Tìm nạp từ Mạng lưới (Network) nếu Cache rỗng
        return fetch(event.request);
      })
  );
});

// Sự kiện Kích hoạt: Xóa bỏ các phiên bản Cache dư thừa cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

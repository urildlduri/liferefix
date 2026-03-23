// Firebase Messaging Service Worker — Liferefix
// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCf_42fqDDl2CR6js4M8Y9_jpQdvVGgNmM",
  authDomain: "liferefix-8f622.firebaseapp.com",
  projectId: "liferefix-8f622",
  storageBucket: "liferefix-8f622.firebasestorage.app",
  messagingSenderId: "965333999360",
  appId: "1:965333999360:web:f711c1590e218c40a4dde5"
});

const messaging = firebase.messaging();

// 백그라운드 푸시 알림 처리
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] 백그라운드 메시지 수신:', payload);

  const title = payload.notification?.title || 'Liferefix 알림';
  const options = {
    body: payload.notification?.body || '새 알림이 도착했습니다.',
    icon: '/liferefix/icon-192.png',
    badge: '/liferefix/icon-192.png',
    data: payload.data || {}
  };

  return self.registration.showNotification(title, options);
});

// 알림 클릭 시 앱으로 이동
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/liferefix/liferefix.html')
  );
});

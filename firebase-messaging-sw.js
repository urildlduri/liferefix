// Firebase Messaging Service Worker
// 이 파일을 liferefix.html과 같은 폴더(루트)에 업로드하세요

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:    "AIzaSyCf_42fqDDl2CR6js4M8Y9_jpQdvVGgNmM",
  projectId: "liferefix-8f622",
  messagingSenderId: "965333999360",
  appId:     "1:965333999360:web:liferefix"
});

var messaging = firebase.messaging();

// 백그라운드 메시지 처리 (앱이 닫혀있을 때)
messaging.onBackgroundMessage(function(payload) {
  console.log('백그라운드 메시지 수신:', payload);
  var title = payload.notification.title || 'Liferefix';
  var body  = payload.notification.body  || '';
  self.registration.showNotification(title, {
    body:  body,
    icon:  '/favicon.ico',
    badge: '/favicon.ico',
    data:  payload.data || {}
  });
});

// 알림 클릭 시 앱으로 이동
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://urildlduri.github.io/liferefix/liferefix.html')
  );
});

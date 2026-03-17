importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCf_42fqDDl2CR6js4M8Y9_jpQdvVGgNmM",
  authDomain:        "liferefix-8f622.firebaseapp.com",
  projectId:         "liferefix-8f622",
  storageBucket:     "liferefix-8f622.firebasestorage.app",
  messagingSenderId: "965333999360",
  appId:             "1:965333999360:web:f711c1590e218c40a4dde5"
});

var messaging = firebase.messaging();

// 백그라운드 메시지 (앱 닫혀있을 때)
messaging.onBackgroundMessage(function(payload) {
  var title = (payload.notification && payload.notification.title) || 'Liferefix';
  var body  = (payload.notification && payload.notification.body)  || '';
  self.registration.showNotification(title, {
    body:  body,
    icon:  '/liferefix/favicon.ico',
    badge: '/liferefix/favicon.ico',
    data:  payload.data || {}
  });
});

// 알림 클릭 → 앱으로 이동
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://urildlduri.github.io/liferefix/liferefix.html')
  );
});

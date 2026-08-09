/* =========================================================
   出退勤検索くん (予備ダイヤ) - プッシュ通知受信用 Service Worker

   ファイル名は firebase-messaging-sw.js から変えてはいけない。
   Firebase がこの名前で探しに来るため。
   ========================================================= */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// 5つのアプリはすべて同じ Firebase プロジェクトを使う。設定も共通で問題ない。
firebase.initializeApp({
  apiKey: "AIzaSyAtawIGwf6hfZU3o79JN5R83CLmTivQVIg",
  authDomain: "shukkin-notify.firebaseapp.com",
  projectId: "shukkin-notify",
  storageBucket: "shukkin-notify.firebasestorage.app",
  messagingSenderId: "587667482421",
  appId: "1:587667482421:web:080064fd0444ff49f90e7c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // 【二重表示を防ぐ】
  // notification 付きのメッセージはブラウザが自動で1件出す。
  // ここで重ねると2件並ぶので、その場合は何もしない。
  if (payload && payload.notification) return;

  const d = (payload && payload.data) || {};
  return self.registration.showNotification(d.title || '🚌 出退勤検索くん', {
    body: d.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: d.tag || 'shukkin-push',
    vibrate: [200, 100, 200]
  });
});

/* 通知をタップしたらアプリを開く */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

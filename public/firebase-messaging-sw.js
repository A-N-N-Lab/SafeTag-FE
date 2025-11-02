// /* global self, importScripts, firebase */
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyAwoPVp3d1g5CI8G0Y8DBIdz7Y70icXCo8",
//   authDomain: "safetag-be03e.firebaseapp.com",
//   projectId: "safetag-be03e",
//   storageBucket: "safetag-be03e.firebasestorage.app",
//   messagingSenderId: "283209181011",
//   appId: "1:283209181011:web:efd45fe1566ad55e59a3a6",
// });

// // 백그라운드 메시지 처리
// const messaging = firebase.messaging();

// 혹몰  여기다가
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAwoPVp3d1g5CI8G0Y8DBIdz7Y70icXCo8",
  authDomain: "safetag-be03e.firebaseapp.com",
  projectId: "safetag-be03e",
  storageBucket: "safetag-be03e.firebasestorage.app",
  messagingSenderId: "283209181011",
  appId: "1:283209181011:web:efd45fe1566ad55e59a3a6",
});

const messaging = firebase.messaging();

// 1) 백그라운드 수신 (v9+ compat: onBackgroundMessage)
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title =
    data.title ||
    (payload.notification && payload.notification.title) ||
    "SafeTag";
  const body =
    data.body ||
    (payload.notification && payload.notification.body) ||
    "알림이 도착했습니다.";

  const options = {
    body,
    data, // 클릭 시 sessionId 접근
    // icon: "/icons/icon-192.png",
    // badge: "/icons/badge.png",
  };

  self.registration.showNotification(title, options);
});

// 2) 알림 클릭 → /call/:sessionId 로 포커스/열기
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification?.data || {};
  const sessionId = (
    data.sessionId ||
    (data.qrId ? String(data.qrId) : "") ||
    ""
  ).trim();

  const urlToOpen = sessionId
    ? `/call?sid=${encodeURIComponent(sessionId)}`
    : "/main";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // 이미 열린 탭이 있으면 활성화
      for (const client of allClients) {
        try {
          // 앱 라우터에게 알려주고 포커스
          client.postMessage({ type: "OPEN_CALL", sessionId });
        } catch (_) {}
        if ("focus" in client) return client.focus();
      }

      // 없으면 새 창
      return clients.openWindow(urlToOpen);
    })()
  );
});

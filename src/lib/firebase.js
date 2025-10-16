import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAwoPVp3d1g5CI8G0Y8DBIdz7Y70icXCo8",
  authDomain: "safetag-be03e.firebaseapp.com",
  projectId: "safetag-be03e",
  storageBucket: "safetag-be03e.firebasestorage.app",
  messagingSenderId: "283209181011",
  appId: "1:283209181011:web:efd45fe1566ad55e59a3a6",
};

const app = initializeApp(firebaseConfig);

// JS 버전: 토큰을 리턴해줌 (UI에서 성공/실패 표시하기 쉬움)
export async function setupFcm(vapidPublicKey) {
  const ok = await isSupported();
  if (!ok) throw new Error("FCM not supported in this browser");

  // SW 등록 (루트 경로 고정)
  const reg = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  const messaging = getMessaging(app);

  // 권한
  const permission = await Notification.requestPermission();
  if (permission !== "granted")
    throw new Error("Notification permission denied");

  // (선택) 깔끔하게 재발급
  try {
    await deleteToken(messaging);
  } catch (_) {}

  // 토큰 발급
  const token = await getToken(messaging, {
    vapidKey: vapidPublicKey,
    serviceWorkerRegistration: reg,
  });
  if (!token) throw new Error("Failed to issue FCM token");
  console.log("[FCM] token issued:", token);

  // 포그라운드 메시지 처리 (data-only 우선)
  onMessage(messaging, (payload) => {
    console.log("[FCM foreground message]", payload);

    const data = payload.data || {};
    const title =
      data.title ||
      (payload.notification && payload.notification.title) ||
      "SafeTag";
    const body =
      data.body ||
      (payload.notification && payload.notification.body) ||
      "알림이 도착했습니다.";
    const sid = data.sessionId;

    if (Notification.permission === "granted") {
      try {
        const n = new Notification(title, { body, data });
        n.onclick = () => {
          window.dispatchEvent(
            new CustomEvent("FCM_OPEN_CALL", { detail: { sessionId: sid } })
          );
          window.focus();
        };
      } catch (e) {
        console.warn("Notification error:", e);
        window.dispatchEvent(
          new CustomEvent("FCM_OPEN_CALL", { detail: { sessionId: sid } })
        );
      }
    } else {
      window.dispatchEvent(
        new CustomEvent("FCM_OPEN_CALL", { detail: { sessionId: sid } })
      );
    }
  });

  return token;
}

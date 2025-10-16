import { useMemo, useState } from "react";
import { setupFcm } from "../../lib/firebase";
import { saveFcmToken } from "../../api/fcmToken";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";
console.log(
  "[VAPID]",
  VAPID_PUBLIC_KEY ? VAPID_PUBLIC_KEY.slice(0, 8) + "..." : "(empty)"
);

export default function EnablePushButton() {
  // idle | working | ok | denied | issue_failed | save_failed | config_error
  const [status, setStatus] = useState("idle");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // iOS PWA(홈화면 실행) 안내
  const isStandalone = useMemo(() => {
    const w = typeof window !== "undefined" ? window : null;
    const n = typeof navigator !== "undefined" ? navigator : null;
    const iosStandalone = !!(n && "standalone" in n && n.standalone === true);
    const displayStandalone = !!(
      w &&
      w.matchMedia &&
      w.matchMedia("(display-mode: standalone)").matches
    );
    return iosStandalone || displayStandalone;
  }, []);

  async function onEnable() {
    if (status === "working") return;
    setStatus("working");
    setMessage("");
    setToken("");

    try {
      console.log("[ENV] VAPID:", VAPID_PUBLIC_KEY?.slice(0, 8));
      if (!VAPID_PUBLIC_KEY) {
        setStatus("config_error");
        setMessage("VAPID 공개키가 비어 있습니다. .env 설정을 확인하세요.");
        return;
      }

      // 1) 토큰 발급
      let issuedToken = "";
      try {
        issuedToken = await setupFcm(VAPID_PUBLIC_KEY);
        if (!issuedToken) {
          setStatus(
            Notification?.permission === "denied" ? "denied" : "issue_failed"
          );
          setMessage("FCM 토큰을 발급받지 못했습니다.");
          return;
        }
        console.log("[FCM] token:", issuedToken);
        setToken(issuedToken);
      } catch (e) {
        console.warn("FCM issue error:", e);
        setStatus(
          Notification?.permission === "denied" ? "denied" : "issue_failed"
        );
        setMessage(e?.message || "토큰 발급 중 오류가 발생했습니다.");
        return;
      }

      // 2) 서버 저장
      try {
        await saveFcmToken(issuedToken); // axios 인터셉터로 Auth 붙는 상황 가정
      } catch (e) {
        console.warn("FCM save error:", e);
        setStatus("save_failed");
        setMessage("토큰은 발급되었지만 서버 저장에 실패했습니다.");
        return;
      }

      // 3) 완료
      setStatus("ok");
      setMessage("");
    } catch (e) {
      console.error("Enable push unexpected:", e);
      setStatus("issue_failed");
      setMessage(e?.message || "알 수 없는 오류가 발생했습니다.");
    }
  }

  const renderStatus = () => {
    switch (status) {
      case "ok":
        return (
          <p style={{ marginTop: 8, color: "#0E7A00" }}>
            ✅ 알림 활성화 완료! (토큰 서버 저장)
          </p>
        );
      case "denied":
        return (
          <p style={{ marginTop: 8, color: "#B91C1C" }}>
            ❌ 알림이 차단되었습니다. 브라우저/OS 설정에서 알림 권한을 허용해
            주세요.
          </p>
        );
      case "config_error":
        return <p style={{ marginTop: 8, color: "#B45309" }}>⚠️ {message}</p>;
      case "issue_failed":
        return (
          <p style={{ marginTop: 8, color: "#B45309" }}>
            ⚠️ 토큰 발급 실패. HTTPS/서비스워커/VAPID 키/브라우저 지원 여부를
            확인해 주세요.
            {message ? ` (${message})` : ""}
          </p>
        );
      case "save_failed":
        return (
          <p style={{ marginTop: 8, color: "#B45309" }}>
            ⚠️ 토큰은 발급되었지만 서버 저장에 실패했습니다. 네트워크/로그인
            상태를 확인해 주세요.
            {message ? ` (${message})` : ""}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        margin: 12,
        padding: 12,
        borderRadius: 12,
        background: "#F4F6F8",
        border: "1px solid #E5E7EB",
      }}
    >
      {!isStandalone && (
        <p style={{ marginBottom: 8, fontSize: 13, color: "#555" }}>
          iPhone 사파리라면 <b>홈 화면에 추가</b>한 아이콘으로 실행해야 알림이
          동작해요.
        </p>
      )}

      <button
        onClick={onEnable}
        disabled={status === "working"}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "none",
          background: "#111827",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {status === "working" ? "설정 중…" : "알림 활성화"}
      </button>

      {renderStatus()}

      {token && (
        <details style={{ marginTop: 8 }}>
          <summary>토큰 보기</summary>
          <code style={{ wordBreak: "break-all", fontSize: 12 }}>{token}</code>
        </details>
      )}
    </div>
  );
}

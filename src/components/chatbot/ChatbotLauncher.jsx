import React, { useEffect, useRef } from "react";

const STORAGE_KEY = "safetag_my_sticker";
const CHATBOT_URL = import.meta.env.VITE_CHATBOT_BASE
  ? `${import.meta.env.VITE_CHATBOT_BASE}/web` // 예: FastAPI의 웹 챗봇 UI 라우트
  : "http://127.0.0.1:8000/web";

export default function ChatbotLauncher({ onIssued = () => {} }) {
  const winRef = useRef(null);

  useEffect(() => {
    const onMessage = (e) => {
      // 보안상 origin 체크를 하려면 아래에 허용 origin을 넣기
      // if (e.origin !== new URL(CHATBOT_URL).origin) return;

      const data = e.data;
      if (!data || typeof data !== "object") return;

      // 챗봇이 발급에 성공하면 아래 형태로 postMessage를 보낸다고 가정
      // { type: "STICKER_ISSUED", payload: {...} }
      if (data.type === "STICKER_ISSUED" && data.payload) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              stickerId: data.payload.stickerId || data.payload.id || "",
              type: data.payload.type || data.payload.stickerType || "PREGNANT",
              carNumber:
                data.payload.carNumber || data.payload.vehicleNumber || "",
              issuedAt: data.payload.issuedAt || new Date().toISOString(),
              expiresAt: data.payload.expiresAt || null,
              imageUrl: data.payload.imageUrl || "/Sticker.png",
              issuer: data.payload.issuer || "SAFETAG",
            })
          );
        } catch {}
        onIssued();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onIssued]);

  const openChat = () => {
    // 새 창 또는 모달/iframe로 열어도 됨
    if (!winRef.current || winRef.current.closed) {
      winRef.current = window.open(
        CHATBOT_URL,
        "_blank",
        "width=420,height=700"
      );
    } else {
      winRef.current.focus();
    }
  };

  return (
    <button onClick={openChat} style={{ width: "100%", height: 44 }}>
      챗봇 열기 (서류 제출/발급)
    </button>
  );
}

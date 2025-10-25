import React, { useEffect, useState, useRef } from "react";
import ChatBox from "../components/chatbot/ChatBox";
import { postChat } from "../api/chatbot";
import { postOcrSticker } from "../api/client";

const toServerMessages = (history) =>
  history
    .filter((m) => ["user", "assistant", "me"].includes(m.role))
    .map((m) => ({
      role: m.role === "me" ? "user" : m.role,
      content: (m.text ?? m.content ?? "").toString(),
    }));

const ChatbotPage = () => {
  const [height, setHeight] = useState(() =>
    Math.max(
      520,
      (typeof window !== "undefined" ? window.innerHeight : 800) - 120
    )
  );
  const abortRef = useRef(null);

  useEffect(() => {
    const handle = () => setHeight(Math.max(520, window.innerHeight - 120));
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 940, display: "grid", gap: 16 }}>
        <ChatBox
          title="SafeTag Chatbot"
          height={height}
          onSend={async (_text, history, file) => {
            try {
              if (abortRef.current) abortRef.current.abort();
              abortRef.current = new AbortController();

              // 파일이 있으면: OCR+발급
              if (file) {
                const jwt =
                  localStorage.getItem("access_token") ||
                  localStorage.getItem("jwt") ||
                  "";
                if (!jwt) return "로그인이 필요합니다.";

                const carNumber =
                  localStorage.getItem("carNumber") || undefined; // ⬅ getItem
                const validDays = 365; // 필요에 따라 730 등으로

                const res = await postOcrSticker(file, jwt, {
                  carNumber,
                  validDays,
                });

                // 응답 유연 처리
                const payload = res?.sticker || {
                  stickerId: res?.stickerId || res?.id || "",
                  type: res?.type || res?.stickerType || "PREGNANT",
                  carNumber: res?.carNumber || carNumber || "",
                  issuedAt: res?.issuedAt || new Date().toISOString(),
                  expiresAt: res?.expiresAt || null,
                  imageUrl: res?.imageUrl || "/Sticker.png",
                  issuer: res?.issuer || "SAFETAG",
                };

                // 저장
                localStorage.setItem(
                  "safetag_my_sticker",
                  JSON.stringify(payload)
                );

                // 메인 앱으로 발급 완료 이벤트 (팝업/iframe 모두 대응하자)
                window.opener?.postMessage(
                  { type: "STICKER_ISSUED", payload },
                  "*"
                ); // ⬅ ?.postMessage
                window.parent?.postMessage(
                  { type: "STICKER_ISSUED", payload },
                  "*"
                ); // ⬅ ?.postMessage

                // 여기서 끝! 아래 일반 대화 로직으로 내려가지 않도록 반환
                return "서류 접수 및 발급이 완료되었습니다. 스티커 화면으로 이동합니다.";
              }

              // 파일이 없으면: 일반 대화
              const msgs = toServerMessages(history);
              if (
                _text &&
                (!msgs.length ||
                  msgs[msgs.length - 1].role !== "user" ||
                  msgs[msgs.length - 1].content !== _text)
              ) {
                msgs.push({ role: "user", content: _text });
              }

              const res = await postChat(msgs); // { content }
              return res.content ?? "";
            } catch (e) {
              console.error("[chatbot error]", e);
              return "잠시 후 다시 시도해주세요.";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;

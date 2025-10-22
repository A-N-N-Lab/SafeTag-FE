import React, { useEffect, useState, useRef } from "react";
import ChatBox from "../components/chatbot/ChatBox";
import { postChat } from "../api/chatbot"; // { content: string } 반환
import StickerUpload from "../components/Sticker/StickerUpload";

// ChatBox history -> 서버 포맷으로 변환 (me -> user 정규화 포함)
const toServerMessages = (history) =>
  history
    .filter((m) => ["user", "assistant", "me"].includes(m.role))
    .map((m) => ({
      role: m.role === "me" ? "user" : m.role, // me를 user로 치환
      content: (m.text ?? m.content ?? "").toString(),
    }));

export default function ChatbotPage() {
  // 뷰포트 기반 동적 높이(최소 520 보장)
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
          botAvatar="/sefe.png"
          userAvatar="/tag.png"
          onSend={async (_text, history) => {
            try {
              // 중복 요청 취소(빠르게 연타할 때 방어)
              if (abortRef.current) abortRef.current.abort();
              abortRef.current = new AbortController();

              // history에 막 입력한 텍스트가 아직 포함되지 않는 UI라면 보강
              const msgs = toServerMessages(history);
              if (
                _text &&
                (!msgs.length ||
                  msgs[msgs.length - 1].role !== "user" ||
                  msgs[msgs.length - 1].content !== _text)
              ) {
                msgs.push({ role: "user", content: _text });
              }

              // (선택) 시스템 지침을 항상 앞에 붙이고 싶다면 주석 해제
              // msgs.unshift({
              //   role: "system",
              //   content:
              //     "당신은 SafeTag 안내 챗봇입니다. 한글로 간결하고 단계적으로 설명하세요.",
              // });

              const res = await postChat(msgs); // { content }
              return res.content ?? "";
            } catch (e) {
              console.error("[chatbot error]", e);
              return "잠시 후 다시 시도해주세요.";
            }
          }}
        />

        {/* 파일 업로드로 OCR+스티커 발급 (채팅과 별도 플로우) */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
          <StickerUpload />
        </div>
      </div>
    </div>
  );
}

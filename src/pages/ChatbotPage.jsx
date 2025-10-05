import React, { useEffect, useState } from "react";
import ChatBox from "../components/common/ChatBox";
import { postChat } from "../api/chatbot"; // { content: string } 반환

// ChatBox의 history -> 서버 포맷으로 변환
const toServerMessages = (history) =>
  history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role, // "user" | "assistant"
      content: m.text ?? "", // 서버는 content 필드 사용
    }));

export default function ChatbotPage() {
  // 뷰포트 기반 동적 높이(최소 520 보장)
  const [height, setHeight] = useState(() =>
    Math.max(
      520,
      (typeof window !== "undefined" ? window.innerHeight : 800) - 120
    )
  );

  useEffect(() => {
    const handle = () => setHeight(Math.max(520, window.innerHeight - 120));
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
      <ChatBox
        title="safetag chatbot"
        height={height}
        botAvatar="/sefe.png"
        userAvatar="/tag.png"
        onSend={async (_text, history) => {
          try {
            const msgs = toServerMessages(history);
            const res = await postChat(msgs); // { content }
            return res.content ?? "";
          } catch (e) {
            console.error("[chatbot error]", e);
            return "잠시 후 다시 시도해주세요.";
          }
        }}
      />
    </div>
  );
}

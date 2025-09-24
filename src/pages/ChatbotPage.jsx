import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

export default function ChatbotUI({
  title = "Chatbot",
  placeholder = "메시지를 입력하세요… (Enter 전송, Shift+Enter 줄바꿈)",
  height = 640,
  initialMessages = [
    { id: "sys-hello", role: "assistant", text: "무엇을 도와드릴까요?" },
  ],
  onSend = async (t) =>
    new Promise((resolve) => setTimeout(() => resolve(`Echo: ${t}`), 600)),
  showHeader = true,
  showFooter = true,
  borderless = false,
}) {
  const [messages, setMessages] = useState(() => initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const autoGrow = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };
  useEffect(() => autoGrow(), [input]);

  const timeNow = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: timeNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setTyping(true);

    try {
      const reply = await onSend(text);
      const assistantText =
        typeof reply === "string" ? reply : reply?.text || "";
      const isError = typeof reply === "object" && reply?.error === true;

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: isError ? "error" : "assistant",
          text: assistantText || "(응답 없음)",
          time: timeNow(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "error",
          text: "응답 중 오류가 발생했어요. 네트워크 상태를 확인하거나 다시 시도해 주세요.",
          time: timeNow(),
        },
      ]);
    } finally {
      setTyping(false);
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerStyle = useMemo(() => ({ height }), [height]);

  return (
    <Shell $borderless={borderless} style={containerStyle}>
      {showHeader && (
        <HeaderBar>
          <HeaderTitle>Chatbot</HeaderTitle>
        </HeaderBar>
      )}

      <List ref={listRef}>
        {messages.map((m) => (
          <MessageRow key={m.id} $right={m.role === "user"}>
            {m.role === "user" ? (
              <Avatar src="/safe.jpg" alt="user" />
            ) : (
              <Avatar src="/tag.jpg" alt="bot" />
            )}
            <Bubble
              $role={m.role}
              title={m.time ? `${m.role} · ${m.time}` : m.role}
            >
              {m.text}
            </Bubble>
          </MessageRow>
        ))}

        {typing && (
          <MessageRow>
            <Avatar src="/tag.jpg" alt="bot" />
            <TypingBubble>
              <Dot />
              <Dot />
              <Dot />
            </TypingBubble>
          </MessageRow>
        )}
      </List>

      {showFooter && (
        <Composer>
          <TextArea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={sending}
            rows={1}
          />
          <SendBtn onClick={handleSend} disabled={sending || !input.trim()}>
            {sending ? "전송 중…" : "전송"}
          </SendBtn>
        </Composer>
      )}
    </Shell>
  );
}

/* ======================= Styles ======================= */
const Shell = styled.div`
  width: 100%;
  max-width: 820px;
  height: ${(p) =>
    typeof p.style?.height === "number"
      ? `${p.style.height}px`
      : p.style?.height || "640px"};
  background: #ffffff;
  border: ${(p) => (p.$borderless ? "none" : "1px solid #e8e8ef")};
  border-radius: 14px;
  box-shadow: ${(p) =>
    p.$borderless ? "none" : "0 8px 30px rgba(0,0,0,0.06)"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px 0 14px;
  border-bottom: 1px solid #f0f0f5;
  background: linear-gradient(180deg, #fafafc 0%, #f6f7fb 100%);
`;

const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #1a1a2b;
  text-align: center;
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 4px 14px;
  background: linear-gradient(180deg, #fcfcff 0%, #ffffff 60%);
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 8px 0;
  justify-content: ${(p) => (p.$right ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  max-width: 80%;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.45;
  border-radius: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${(p) =>
    p.$role === "user"
      ? "#0e1222"
      : p.$role === "error"
      ? "#991b1b"
      : "#0b1020"};
  background: ${(p) =>
    p.$role === "user"
      ? "#e7f0ff"
      : p.$role === "error"
      ? "#fee2e2"
      : "#f4f6fb"};
  border: 1px solid
    ${(p) =>
      p.$role === "error"
        ? "#fecaca"
        : p.$role === "user"
        ? "#c8dbff"
        : "#e8ebf5"};
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
`;

const dots = keyframes`
  0% { opacity: 0.2; transform: translateY(0px); }
  50% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 0.2; transform: translateY(0px); }
`;

const TypingBubble = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f4f6fb;
  border: 1px solid #e8ebf5;
  padding: 10px 12px;
  border-radius: 12px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9aa3b2;
  animation: ${dots} 1.2s infinite ease-in-out;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const Composer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  border-top: 1px solid #f0f0f5;
  padding: 10px;
  background: #ffffff;
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid #e4e6ef;
  border-radius: 12px;
  padding: 10px 12px;
  min-height: 44px;
  max-height: 200px;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  background: #fff;
  &:focus {
    border-color: #7da8ff;
    box-shadow: 0 0 0 3px rgba(125, 168, 255, 0.2);
  }
  &::placeholder {
    color: #a3a8b7;
  }
`;

const SendBtn = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e4e6ef;
  background: #0f62fe;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.05s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 4px 10px rgba(15, 98, 254, 0.18);
  &:hover {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

const ChatBox = ({
  title = "safetag chatbot",
  placeholder = "챗봇에게 물어보세요!",
  height = 640,
  initialMessages = [
    { id: "sys-hello", role: "assistant", text: "무엇을 도와드릴까요?" },
  ],
  onSend = async (t, _history) =>
    new Promise((resolve) => setTimeout(() => resolve(`Echo: ${t}`), 600)),
}) => {
  const [messages, setMessages] = useState(() => initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setSending(true);
    setTyping(true);

    try {
      const history = [...messages, userMsg];
      const reply = await onSend(text, history);
      setMessages((p) => [
        ...p,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: reply || "(응답 없음)",
        },
      ]);
    } finally {
      setTyping(false);
      setSending(false);
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
    <Shell style={containerStyle}>
      <HeaderBar>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderBar>

      <List ref={listRef}>
        {messages.map((m) => (
          <Row key={m.id} $mine={m.role === "user"}>
            {m.role !== "user" && <Avatar src="/icons/bot.png" />}
            <Bubble $role={m.role}>{m.text}</Bubble>
            {m.role === "user" && <Avatar src="/icons/user.png" />}
          </Row>
        ))}

        {typing && (
          <Row>
            <Avatar src="/icons/bot.png" />
            <TypingBubble>
              <Dot />
              <Dot />
              <Dot />
            </TypingBubble>
          </Row>
        )}
      </List>

      <Footer>
        <InputShell>
          <TextArea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={sending}
            rows={1}
          />
        </InputShell>
        <SendBtn onClick={handleSend} disabled={sending || !input.trim()}>
          전송
        </SendBtn>
      </Footer>
    </Shell>
  );
};

export default ChatBox;

const Shell = styled.div`
  width: 100%;
  max-width: 420px;
  background: #f2f4f7;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled.div`
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-bottom: 1px solid #eceff3;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
`;

const Row = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$mine ? "flex-end" : "flex-start")};
  gap: 8px;
  margin: 8px 0;
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  white-space: pre-wrap;
  ${(p) =>
    p.$role === "user"
      ? css`
          background: #ffe28a;
        `
      : css`
          background: #ffffff;
          border: 1px solid #e7eaf0;
        `}
`;

const dots = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const TypingBubble = styled.div`
  display: flex;
  gap: 4px;
  background: #fff;
  border: 1px solid #e7eaf0;
  padding: 10px 14px;
  border-radius: 16px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: ${dots} 1.2s infinite;
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #f2f4f7;
`;

const InputShell = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 22px;
  border: 1px solid #ddd;
  padding: 8px 12px;
`;

const TextArea = styled.textarea`
  border: none;
  outline: none;
  resize: none;
  width: 100%;
  font-size: 14px;
`;

const SendBtn = styled.button`
  background: #0f62fe;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0 16px;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

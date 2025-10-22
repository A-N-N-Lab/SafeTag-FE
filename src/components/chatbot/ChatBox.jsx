import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { postChat } from "../../api/chatbot";

const DEFAULT_INIT = [
  { id: "sys-hello", role: "assistant", text: "무엇을 도와드릴까요?" },
];

export default function ChatBox({
  title = "safetag chatbot",
  placeholder = "챗봇에게 물어보세요!",
  height = 560,
  initialMessages = DEFAULT_INIT,
  onSend,
  botAvatar = "/seipi.png",
  userAvatar = "/taegi.png",
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };
  const handleAttachmentClick = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  const toServerMessages = (arr) =>
    arr
      .filter((m) => ["user", "assistant", "system"].includes(m.role))
      .map((m) => ({ role: m.role, content: m.text ?? "" }));

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !selectedFile) || sending) return;

    const messageText = text || `파일 전송: ${selectedFile.name}`;
    const userMsg = { id: `u-${Date.now()}`, role: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedFile(null);
    setSending(true);
    setTyping(true);

    try {
      let content = "";
      if (typeof onSend === "function") {
        content = await onSend(text, [...messages, userMsg], selectedFile);
      } else {
        const serverMsgs = toServerMessages([...messages, userMsg]);
        const data = await postChat(serverMsgs);
        content = (data?.content ?? data?.reply ?? "").toString();
      }
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: content || "…" },
      ]);
    } catch (e) {
      // 사용자 친화 문구 + 디버그 토글
      const debug = e?.message || "Unknown error";
      const pretty =
        "백엔드에서 오류가 발생했어요. 잠시 후 다시 시도해 주세요.\n(자세히 보기를 눌러 오류 내용을 확인할 수 있어요)";
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: `${pretty}\n\n[자세히 보기]\n${debug}`,
        },
      ]);
      console.error("chat fail:", e);
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Wrap style={{ height }}>
      <Header>{title}</Header>

      <List ref={listRef}>
        {messages.map((m) => (
          <Row key={m.id} $me={m.role === "user"}>
            {m.role === "assistant" && (
              <Avatar>
                <img src={botAvatar} alt="assistant" />
              </Avatar>
            )}
            <Bubble $me={m.role === "user"}>
              <pre>{m.text}</pre>
            </Bubble>
            {m.role === "user" && (
              <Avatar>
                <img src={userAvatar} alt="user" />
              </Avatar>
            )}
          </Row>
        ))}

        {typing && (
          <Row>
            <Avatar>
              <img src={botAvatar} alt="assistant" />
            </Avatar>
            <TypingBubble>
              <Dot />
              <Dot />
              <Dot />
            </TypingBubble>
          </Row>
        )}
      </List>

      <Footer>
        <InputBox>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
        </InputBox>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <FileBtn onClick={handleAttachmentClick} disabled={sending}>
          📁
        </FileBtn>

        <SendBtn
          onClick={handleSend}
          disabled={sending || (!input.trim() && !selectedFile)}
        >
          전송
        </SendBtn>
      </Footer>
    </Wrap>
  );
}

/* styled-components */
const Wrap = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;
const Header = styled.div`
  padding: 14px 16px;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;
const List = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  ${(p) =>
    p.$me ? "justify-content: flex-end;" : "justify-content: flex-start;"}
`;
const Avatar = styled.div`
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 50%;
  overflow: hidden;
  background: #f2f6f3;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Bubble = styled.div`
  max-width: 72%;
  padding: 10px 12px;
  border-radius: 14px;
  background: ${(p) => (p.$me ? "#f3f9f4" : "#ffffff")};
  border: 1px solid ${(p) => (p.$me ? "#cfe8d1" : "#ececec")};
  box-shadow: ${(p) =>
    p.$me ? "0 2px 8px rgba(78,147,102,0.12)" : "0 2px 8px rgba(0,0,0,0.06)"};
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.45;
    color: #222;
  }
`;
const blink = keyframes`0%{opacity:.25}50%{opacity:1}100%{opacity:.25}`;
const TypingBubble = styled(Bubble)`
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
`;
const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8bbf92;
  animation: ${blink} 1s infinite;
`;
const Footer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
`;
const InputBox = styled.div`
  flex: 1;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  background: #fff;
`;
const Textarea = styled.textarea`
  border: none;
  outline: none;
  flex: 1;
  resize: none;
  max-height: 130px;
  min-height: 24px;
  line-height: 1.4;
  font-size: 14px;
`;
const FileBtn = styled.button`
  min-width: 30px;
  border: none;
  border-radius: 12px;
  background: #b0bfcc;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  padding: 0 10px;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
const SendBtn = styled.button`
  min-width: 60px;
  border: none;
  border-radius: 12px;
  background: #6b89b9;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  padding: 0 10px;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

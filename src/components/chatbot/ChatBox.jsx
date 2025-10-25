import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { postChat } from "../../api/chatbot";

const BASE = import.meta.env.BASE_URL || "/";
const DEFAULT_BOT = `${BASE}seipi.png`;
const DEFAULT_USER = `${BASE}taegi.png`;

const DEFAULT_INIT = [
  { id: "sys-hello", role: "assistant", text: "무엇을 도와드릴까요?" },
];

const ChatBox = ({
  title = "safetag chatbot",
  placeholder = "챗봇에게 물어보세요!",
  height = 560,
  initialMessages = DEFAULT_INIT,
  onSend,
  botAvatar = DEFAULT_BOT,
  userAvatar = DEFAULT_USER,
}) => {
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
      // 이미지/파일 메시지는 서버로 안 보냄
      .filter(
        (m) => ["user", "assistant", "system"].includes(m.role) && !m.type
      )
      .map((m) => ({ role: m.role, content: m.text ?? "" }));

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !selectedFile) || sending) return;

    // 1) 사용자가 텍스트 보냈다면 텍스트 메시지 추가
    const newMsgs = [];
    if (text) {
      newMsgs.push({
        id: `u-${Date.now()}`,
        role: "user",
        type: "text",
        text,
      });
    }

    // 2) 파일이 있다면 미리보기 메시지(이미지/파일) 추가
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith("image/");
      const url = URL.createObjectURL(selectedFile);
      newMsgs.push({
        id: `uf-${Date.now()}`,
        role: "user",
        type: isImage ? "image" : "file",
        name: selectedFile.name,
        fileType: selectedFile.type,
        url, // 미리보기 URL
      });
    }

    setMessages((prev) => [...prev, ...newMsgs]);
    setInput("");
    setTyping(true);
    setSending(true);

    try {
      let content = "";
      if (typeof onSend === "function") {
        // onSend가 파일 업로드까지 처리하는 경우 세 번째 인자로 파일 전달
        content = await onSend(text, [...messages, ...newMsgs], selectedFile);
      } else {
        const serverMsgs = toServerMessages([...messages, ...newMsgs]);
        const data = await postChat(serverMsgs);
        content = (data?.content ?? data?.reply ?? "").toString();
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: content || "…",
        },
      ]);
    } catch (e) {
      const debug = e?.message || "Unknown error";
      const pretty =
        "백엔드에서 오류가 발생했어요. 잠시 후 다시 시도해 주세요.\n(자세히 보기를 눌러 오류 내용을 확인할 수 있어요)";
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: `${pretty}\n\n[자세히 보기]\n${debug}`,
        },
      ]);
      console.error("chat fail:", e);
    } finally {
      setSelectedFile(null); // 파일 선택 초기화
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
              {m.type === "image" ? (
                <ImgPreview src={m.url} alt={m.name || "image"} />
              ) : m.type === "file" ? (
                <FilePreview>
                  <div>📎 {m.name}</div>
                  <a href={m.url} download={m.name}>
                    다운로드
                  </a>
                </FilePreview>
              ) : (
                <pre>{m.text}</pre>
              )}
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
        <FileBtn
          onClick={handleAttachmentClick}
          disabled={sending}
          title="파일 첨부"
        >
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
};

export default ChatBox;

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
const ImgPreview = styled.img`
  display: block;
  max-width: 240px;
  max-height: 240px;
  border-radius: 10px;
  object-fit: cover;
`;
const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  a {
    text-decoration: underline;
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

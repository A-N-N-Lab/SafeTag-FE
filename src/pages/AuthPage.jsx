import React, { useMemo } from "react";
import styled from "styled-components";
import ChatbotLauncher from "../components/chatbot/ChatbotLauncher";

const STORAGE_KEY = "safetag_my_sticker";

export default function AuthPage() {
  // 로컬에 저장된 최근 발급 스티커(챗봇에서 postMessage로 저장됨)
  const sticker = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const onIssued = () => {
    // 챗봇 발급 완료 시 호출됨(저장은 ChatbotLauncher가 이미 수행)
    window.location.href = "/sticker";
  };

  const title =
    sticker?.type === "PREGNANT"
      ? "임산부: 본인"
      : sticker?.type === "DISABLED"
      ? "장애인: 본인"
      : sticker
      ? "거주민"
      : "발급된 스티커 없음";

  const fmt = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}년 ${m}월 ${day}일`;
  };

  return (
    <AppContainer>
      <HeaderWrapper>
        <HeaderText>권한 인증</HeaderText>
      </HeaderWrapper>

      {/* 현재 상태 박스 */}
      <Section>
        <BlockTitle>내 스티커 현황</BlockTitle>
        <Card>
          <Thumb src={sticker?.imageUrl || "/Sticker.png"} alt="sticker" />
          <Info>
            <Line strong>{title}</Line>
            <Line>차량번호: {sticker?.carNumber || "-"}</Line>
            <Line>발급일: {fmt(sticker?.issuedAt)}</Line>
            <Line>유효기간: {fmt(sticker?.expiresAt)}</Line>
            <Btns>
              <Btn onClick={() => (window.location.href = "/sticker")}>
                스티커 전체 보기
              </Btn>
            </Btns>
          </Info>
        </Card>
        {!sticker && (
          <Hint>
            아직 스티커가 없어요. 아래 버튼으로 챗봇에서 발급해 주세요.
          </Hint>
        )}
      </Section>

      {/* 챗봇 발급/재발급 */}
      <Section>
        <BlockTitle>발급 / 재발급</BlockTitle>
        <ChatbotLauncher onIssued={onIssued} />
        <Small>※ 챗봇에서 서류 제출·검증 후 발급되면 자동 저장됩니다.</Small>
      </Section>
    </AppContainer>
  );
}

/* styles */
const AppContainer = styled.div`
  min-height: 100vh;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  background: #fff;
  padding: 20px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
const HeaderText = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;
const Section = styled.div`
  padding: 16px;
`;
const BlockTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0;
`;
const Card = styled.div`
  background: #fff;
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
`;
const Thumb = styled.img`
  width: 92px;
  height: auto;
  border: 1px solid #eee;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;
const Line = styled.div`
  font-size: ${(p) => (p.strong ? "16px" : "14px")};
  font-weight: ${(p) => (p.strong ? 700 : 400)};
  color: ${(p) => (p.strong ? "#222" : "#555")};
`;
const Btns = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 8px;
`;
const Btn = styled.button`
  padding: 8px 12px;
  border: 1px solid #222;
  background: #222;
  color: #fff;
  border-radius: 6px;
`;
const Small = styled.div`
  margin-top: 8px;
  color: #666;
  font-size: 12px;
`;
const Hint = styled.div`
  margin-top: 8px;
  color: #888;
  font-size: 13px;
`;

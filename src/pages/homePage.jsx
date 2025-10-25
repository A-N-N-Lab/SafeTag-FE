import React, { useRef } from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import ChatbotLauncher from "../components/chatbot/ChatbotLauncher";

export default function HomePage() {
  const nav = useNavigate();
  const botRef = useRef(null);

  const openChat = () => {
    botRef.current?.open();
  };
  const goAuth = () => nav("/auth");

  return (
    <Wrap>
      <ChatbotLauncher
        ref={botRef}
        renderButton={false}
        onIssued={() => nav("/sticker")}
      />
      <Header />

      {/* QR 스캔 카드 */}
      <Section>
        <QRCard onClick={() => nav("/qr")}>
          <QRLeft>
            <QRTitle>QR 스캔</QRTitle>
            <QRDesc>
              차량에 부착된 QR을 스캔하면 차주에게 연락할 수 있어요.
            </QRDesc>
          </QRLeft>
          <QRIcon aria-hidden>
            <img src="../qrimage.png" alt="" />
          </QRIcon>
        </QRCard>
      </Section>

      {/* 챗봇 검색바(얇은 입력 바) */}
      <Section>
        <SearchBar onClick={openChat} role="button" tabIndex={0}>
          <SearchInput placeholder="챗봇에게 물어보세요!" readOnly />
          <Mic aria-hidden>
            <img src="../../search-icon.png" alt="" />
          </Mic>
        </SearchBar>
      </Section>

      {/* 차량 관리 */}
      <Section>
        <H2>차량 관리</H2>
        <PillRow>
          <Pill onClick={goAuth}>
            <Icon img="/auth-icon.png" />
            권한 인증
          </Pill>
          <Pill onClick={() => alert("고객센터 연결 예정")}>
            <Icon img="/callcen-icon.png" />
            고객센터
          </Pill>
        </PillRow>
      </Section>

      {/* 2열 카드 그리드 */}
      <Section>
        <Grid>
          <Card>
            <CardTitle>마트</CardTitle>
            <CardRow>
              <Mini>
                <MiniIcon src="/receipt-icon.png" alt="" />
                <MiniLabel>영수증 스캔</MiniLabel>
              </Mini>
              <Mini>
                <MiniIcon src="/card-icon.png" alt="" />
                <MiniLabel>사전 정산</MiniLabel>
              </Mini>
            </CardRow>
          </Card>

          <Card>
            <CardTitle>기타</CardTitle>
          </Card>
        </Grid>
      </Section>

      {/* 안내/푸터 영역은 각 컴포넌트 내부에서 렌더되는 것으로 가정 */}
    </Wrap>
  );
}

/* ============ styled ============ */

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent; /* Surface가 흰색 */
`;

const Section = styled.section`
  padding: 0 12px;
`;

/* QR 카드 */
const QRCard = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #6b89b9; /* 목업의 하늘색 톤 */
  color: #fff;
  border: 0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  text-align: left;
  min-height: 120px;
`;

const QRLeft = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const QRTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
`;

const QRDesc = styled.div`
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
`;

const QRIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  overflow: hidden;

  img {
    width: 48px;
    height: 48px;
    display: block;
  }
`;

/* 검색바(챗봇 입력) */
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e8ebef;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  cursor: text;
`;

const SearchInput = styled.input`
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  font-size: 14px;
  color: #222;
  &::placeholder {
    color: #9aa6b2;
  }
`;

const Mic = styled.div`
  width: 20px;
  height: 20px;
  opacity: 0.8;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

/* 차량관리 */
const H2 = styled.h2`
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 10px;
`;

const PillRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Pill = styled.button`
  flex: 1 1 0;
  min-width: 0;
  background: #f0f4f8;
  color: #2b3640;
  border: 1px solid #e8ebef;
  border-radius: 999px;
  padding: 12px 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.span`
  width: 18px;
  height: 18px;
  display: inline-block;
  background: url(${(p) => p.img}) center/contain no-repeat;
`;

/* 2열 카드 그리드 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e8ebef;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

const CardRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Mini = styled.button`
  flex: 1 1 0;
  min-width: 0;
  background: #f7f9fc;
  border: 1px solid #e8ebef;
  border-radius: 10px;
  padding: 10px 8px;
  display: grid;
  place-items: center;
  gap: 6px;
`;

const MiniIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const MiniLabel = styled.div`
  font-size: 12px;
  color: #2b3640;
`;

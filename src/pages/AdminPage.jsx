import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header/Header.jsx";
import ChatBox from "../components/common/ChatBox.jsx";
import ActionRow from "../components/common/ActionRow.jsx";
import ActionCard from "../components/common/ActionCard.jsx";
import InfoTile from "../components/common/InfoTile.jsx";
import QRScannerBox from "../components/common/QRScannerBox.jsx"; // 필요시 유지/삭제
// import Navbar from "../components/NavBar/Navbar.jsx"; // RootLayout에서 숨겼다면 중복 제거
import ResultPage from "../components/Admin/ResultPage.jsx";
import { QRCodeCanvas } from "qrcode.react";

const API = import.meta.env.VITE_API_BASE; // .env에 설정
const FRONT = window.location.origin; // 스캔 랜딩 주소 생성용

const AdminPage = () => {
  const [code, setCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [leftSec, setLeftSec] = useState(0);
  const [loading, setLoading] = useState(false);
  const scanUrl = useMemo(
    () => (code ? `${FRONT}/scan?code=${encodeURIComponent(code)}` : ""),
    [code]
  );

  // 만료 카운트다운
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      );
      setLeftSec(diff);
      if (diff === 0) {
        setCode(null);
        setExpiresAt(null);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const createQR = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/qrs`, { method: "POST" });
      if (!res.ok) throw new Error(`QR create failed: ${res.status}`);
      const data = await res.json();
      setCode(data.qrValue);
      setExpiresAt(data.expiredAt);
    } catch (e) {
      alert("QR 생성 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(scanUrl);
      alert("스캔 URL이 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <App>
      <Header />

      {/* QR 생성/표시 영역 */}
      <Card>
        <Title>주차 연락용 QR</Title>
        {!code ? (
          <PrimaryButton onClick={createQR} disabled={loading}>
            {loading ? "생성 중..." : "QR 생성"}
          </PrimaryButton>
        ) : (
          <>
            <QRWrap>
              <QRCodeCanvas value={scanUrl} size={260} />
            </QRWrap>
            <SmallText>{scanUrl}</SmallText>
            <RowGap>
              <SecondaryButton onClick={copyLink}>링크 복사</SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  setCode(null);
                  setExpiresAt(null);
                }}
              >
                초기화
              </SecondaryButton>
            </RowGap>
            <ExpireText>만료까지 {leftSec}s</ExpireText>
          </>
        )}
      </Card>

      {/* 기존 구성 유지: 필요 없으면 주석 처리 */}
      <Row>
        <QRScannerBox />
        <ResultPage />
      </Row>

      <ChatBox maxWidth="370px" />

      <ActionRow
        title="차주에게 연락하기"
        buttons={[
          {
            label: "음성 통화",
            icon: "/call-icon.png",
            onClick: () => {
              /* TODO: 중계 연동 */
            },
          },
          {
            label: "메시지",
            icon: "/message-icon.png",
            onClick: () => {
              /* TODO */
            },
          },
        ]}
      />

      <Row>
        <ActionCard
          title="이벤트 탐지"
          actions={[
            { label: "CCTV", icon: "/cctv-icon.png", onClick: () => {} },
            { label: "차단기", icon: "/cadan-icon.png", onClick: () => {} },
          ]}
        />
        <InfoTile title="기타" />
      </Row>

      {/* RootLayout에서 NavBar를 숨겼다면 여기 넣어도 OK. 중복이면 제거 */}
      {/* <Navbar /> */}
    </App>
  );
};

export default AdminPage;

/* styled-components */
const App = styled.div`
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const QRWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0 4px;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #666;
  word-break: break-all;
  margin: 6px 0 10px;
`;

const ExpireText = styled.p`
  font-size: 12px;
  color: #b00;
  text-align: center;
  margin-top: 4px;
`;

const RowGap = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: #111;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
`;

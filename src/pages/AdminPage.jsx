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

  // --- CCTV 모달 기능 추가 START ---
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  const cctvStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const handleOpenCctvModal = () => setIsCctvModalOpen(true);
  const handleCloseCctvModal = () => setIsCctvModalOpen(false);
  // --- CCTV 모달 기능 추가 END ---

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


      {/* 기존 구성 유지: 필요 없으면 주석 처리 */}
      <Row>
        <QRScannerBox />
        <ResultPage />
      </Row>

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
            { label: "CCTV", icon: "/cctv-icon.png", onClick: handleOpenCctvModal },
            { label: "차단기", icon: "/cadan-icon.png", onClick: () => {} },
          ]}
        />
        <InfoTile title="기타" />
      </Row>

      
      {/* --- CCTV 모달 JSX 추가 --- */}
      {isCctvModalOpen && (
          <ModalBackground onClick={handleCloseCctvModal}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                  <ModalHeader>
                      <h4>CCTV 실시간 영상</h4>
                      <CloseButton onClick={handleCloseCctvModal}>&times;</CloseButton>
                  </ModalHeader>
                  <VideoWrapper>
                      <video controls autoPlay muted playsInline src={cctvStreamUrl} style={{width: '100%', height: '100%'}}></video>
                  </VideoWrapper>
              </ModalContent>
          </ModalBackground>
      )}
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

// --- CCTV 모달 스타일 추가 ---
const ModalBackground = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background-color: #000;
`;


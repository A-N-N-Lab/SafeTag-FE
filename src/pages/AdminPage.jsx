import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header.jsx";
import ChatBox from "../components/common/ChatBox.jsx";
import ActionRow from "../components/common/ActionRow";
import ActionCard from "../components/common/ActionCard.jsx";
import InfoTile from "../components/common/InfoTile.jsx";
import QRScannerBox from "../components/common/QRScannerBox.jsx";
import Navbar from "../components/NavBar/Navbar.jsx";
import ResultPage from "../components/Admin/ResultPage.jsx"; // 이건 관리자 전용이면 그대로

const AdminPage = () => {
  return (
    <App>
      <Header />
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
              /* TODO */
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

      <Navbar />
    </App>
  );
};

export default AdminPage;

const App = styled.div`
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

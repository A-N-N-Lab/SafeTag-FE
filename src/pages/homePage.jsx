import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import ChatBox from "../components/chatbot/ChatBox";
import ActionRow from "../components/common/ActionRow";
import ActionCard from "../components/common/ActionCard";
import InfoTile from "../components/common/InfoTile";
import Navbar from "../components/NavBar/Navbar";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const nav = useNavigate();

  return (
    <App>
      <Header />

      <ChatBox maxWidth="350px" />

      <ActionRow
        title="차량 관리"
        buttons={[
          {
            label: "권한 인증",
            icon: "/auth-icon.png",
            onClick: () => nav("/Auth"),
          },
          { label: "고객센터", icon: "/callcen-icon.png", onClick: () => {} },
        ]}
      />

      <Row>
        <ActionCard
          title="마트"
          w="180px"
          actions={[
            {
              label: "영수증 스캔",
              icon: "/receipt-icon.png",
              onClick: () => {},
            },
            { label: "사전 정산", icon: "/card-icon.png", onClick: () => {} },
          ]}
        />
        <InfoTile title="기타" />
      </Row>

      <Navbar
        items={[
          {
            label: "Home",
            icon: "/menu1.png",
            activeIcon: "/menu11.png",
            path: "/main",
          },
          {
            label: "Sticker",
            icon: "/menu2.png",
            activeIcon: "/menu22.png",
            path: "/Auth",
          },
          {
            label: "QR",
            icon: "/menu3.png",
            activeIcon: "/menu33.png",
            path: "/QR",
          },
          {
            label: "Mypage",
            icon: "/menu4.png",
            activeIcon: "/menu44.png",
            path: "/Mypage",
          },
        ]}
      />
      <div style={{ height: 72 }} />
    </App>
  );
};

export default HomePage;

const App = styled.div`
  width: 100%;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f0f0f0;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

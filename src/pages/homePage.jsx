import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import ChatBox from "../components/chatbot/ChatBox";
import ActionRow from "../components/common/ActionRow";
import ActionCard from "../components/common/ActionCard";
import InfoTile from "../components/common/InfoTile";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const nav = useNavigate();

  return (
    <App>
      <Header />

      <Section>
        <ChatBox maxWidth="350px" />
      </Section>

      <ActionRow
        title="차량 관리"
        buttons={[
          {
            label: "권한 인증",
            icon: "/auth-icon.png",
            onClick: () => nav("/auth"),
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
    </App>
  );
};

export default HomePage;

const App = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
`;

const Section = styled.section`
  padding: 0 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 12px;
  margin-top: 8px;

  > * {
    flex: 1 1 0; /* 양쪽 카드가 자동 나눠가짐 */
    min-width: 0; /* 긴 내용이 있어도 줄여서 들어가게 */
  }
`;

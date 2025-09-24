// import React from "react";
// import styled from "styled-components";
// import Header from "../components/Header/Header";
// import Otp from "../components/home/Otp";
// import Chat from "../components/home/Chat";
// import Mgmt from "../components/home/Mgmt";
// import Mart from "../components/home/Mart";
// import Etc from "../components/home/Etc";
// import Navbar from "../components/NavBar/Navbar";
// import Footer from "../components/Footer/Footer";

// function Home() {
//   const items = [
//     {
//       label: "Home",
//       icon: "/menu1.png",
//       activeIcon: "/menu11.png",
//       path: "/main",
//     },
//     {
//       label: "Sticker",
//       icon: "/menu2.png",
//       activeIcon: "/menu22.png",
//       path: "/Auth",
//     },
//     { label: "QR", icon: "/menu3.png", activeIcon: "/menu33.png", path: "/QR" },
//     {
//       label: "Mypage",
//       icon: "/menu4.png",
//       activeIcon: "/menu44.png",
//       path: "/Mypage",
//     },
//   ];
//   return (
//     <AppContainer>
//       <Header />
//       <Otp />
//       <Chat />
//       <Mgmt />
//       <ArrContainer>
//         {" "}
//         <Mart />
//         <Etc />
//       </ArrContainer>
//       <Footer />
//       <Navbar items={items} />
//       <div style={{ height: 72 }} /> {/* 하단바 가림 방지 여백 */}
//     </AppContainer>
//   );
// }

// export default Home;

// const AppContainer = styled.div`
//   width: 100%;
//   margin: 0 auto;
//   padding-bottom: 150px;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   background-color: #f0f0f0;
// `;

// const ArrContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 20px;
// `;

import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import ChatBox from "../components/common/ChatBox";
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

      <Footer />
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

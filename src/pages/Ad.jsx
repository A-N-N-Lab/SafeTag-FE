import React from "react";
import styled from "styled-components";
import Header from "../components/Ad/Header";
import Otp from "../components/Ad/Otp";
import Chat from "../components/Ad/Chat";
import Mgmt from "../components/Ad/Mgmt";
import Mart from "../components/Ad/Mart";
import Etc from "../components/Ad/Etc";
import Navbar from "../components/Ad/Navbar";
import Footer from "../components/Ad/Footer";
import ResultPage from "../components/Ad/ResultPage";

function Ad() {
  return (
    <AppContainer>
      <Header />
      <ArrContainer>
        {" "}
        <Otp />
        <ResultPage />
      </ArrContainer>

      <Chat />
      <Mgmt />
      <ArrContainer>
        {" "}
        <Mart />
        <Etc />
      </ArrContainer>
      <Footer />
      <Navbar />
    </AppContainer>
  );
}

export default Ad;

const AppContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 393px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const ArrContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

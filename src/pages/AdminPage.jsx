import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Otp from "../components/Ad/Otp";
import Chat from "../components/Ad/Chat";
import Mgmt from "../components/Ad/Mgmt";
import Mart from "../components/Ad/Mart";
import Etc from "../components/Ad/Etc";
import Navbar from "../components/NavBar/Navbar";
import Footer from "../components/Footer/Footer";
import ResultPage from "../components/Ad/ResultPage";

function Adminpage() {

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
      <Navbar />
    </AppContainer>
  );
}

export default Adminpage;

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

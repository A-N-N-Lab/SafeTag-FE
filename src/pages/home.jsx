import React from 'react';
import styled from 'styled-components';
import Header from '../components/home/Header';
import Otp from '../components/home/Otp';
import Chat from '../components/home/Chat';
import Mgmt from '../components/home/Mgmt';
import Mart from '../components/home/Mart';
import Etc from '../components/home/Etc';
import Navbar from '../components/home/Navbar';
import Footer from "../components/home/Footer";

function Home() {
  return (
    <AppContainer>
      <Header />
      <Otp />
      <Chat />
      <Mgmt />
      <ArrContainer>
        {' '}
        <Mart />
        <Etc />
      </ArrContainer>
      <Footer />
      <Navbar />
    </AppContainer>
  );
}

export default Home;

const AppContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f0f0;
`;

const ArrContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;


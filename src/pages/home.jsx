import React from 'react';
import styled from 'styled-components';
import Header from '../components/home/Header';
import Otp from '../components/home/Otp';
import Chat from './components/Chat';
import Mgmt from './components/Mgmt';
import Mart from './components/Mart';
import Etc from './components/Etc';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
  width: 500px;
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

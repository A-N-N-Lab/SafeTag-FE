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

function App() {
  return (
    <AppContainer>
      <Header />
      <Otp />
      <Chat />
      <Mgmt />
      <ArrContainer>
        {' '}
        {/* 두 컴포넌트를 감싸는 div를 styled-component로 교체 */}
        <Mart />
        <Etc />
      </ArrContainer>
      <Footer />
      <Navbar />
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f0f0;
`;

// ArrContainer 스타일 정의
const ArrContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

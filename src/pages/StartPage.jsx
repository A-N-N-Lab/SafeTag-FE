import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../assets/mainLogo.png';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>
          <div>내 차 관리, </div>
          <div>이제 안전해질 거예요</div>
        </Title>
        <Subtitle>지금 세이프태그에 내 차를 등록해보세요</Subtitle>

        <Image src={Logo} alt="메인 로고" />

        <StartButton onClick={() => navigate('/signup')}>시작하기</StartButton>

        <LoginText>
          이미 사용중이신가요?{' '}
          <LoginLink onClick={() => navigate('/login')}>로그인</LoginLink>
        </LoginText>

        <FooterText>
          <div>서비스 시작 시 서비스 이용약관 및 </div>
          <div>개인정보처리방침 동의로 간주됩니다.</div>
        </FooterText>
      </Content>
    </Container>
  );
};

export default StartPage;

const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Content = styled.div`
  text-align: center;
  width: 100%;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
`;

const Image = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 60px;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4a74a9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 40px;
  transition: background 0.2s;

  &:hover {
    background-color: #3a5f8f;
  }
`;

const LoginText = styled.p`
  font-size: 14px;
  color: #666;
`;

const LoginLink = styled.span`
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

const FooterText = styled.p`
  font-size: 12px;
  color: #bbb;
  margin-top: 20px;
`;

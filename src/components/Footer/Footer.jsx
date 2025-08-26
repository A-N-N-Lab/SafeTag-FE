import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background-color: #f1f1f1; 
  text-align: center;
  position: relative;
  bottom: 0; 
  width: 100%; 
  border-top: 1px solid #ccc;
`;

const FooterText = styled.p`
  margin: 5px 0;
  color: #555;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>2025 덕성여자대학교 사이버보안전공 졸업작품</FooterText>
      <FooterText>A.N.N lab</FooterText>
      <FooterText>01369|서울 도봉구 삼양로144길 33 (쌍문동, 덕성여자대학교)</FooterText>
      <FooterText>(ARS) 02-901-8000</FooterText>
      <FooterText>webmaster@duksung.ac.kr</FooterText>
      <FooterText>Copyright (c) DUKSUNG WOMENS UNIVERSITY. All right reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;

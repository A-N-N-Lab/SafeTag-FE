import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  h1 {
    color: rgb(0, 0, 0);
    text-align: left; /* 텍스트 왼쪽 정렬 */
    margin-top: 50px; /* 상단 여백 추가 */
    margin-left: 40px;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h1>123가 1234</h1>
    </HeaderContainer>
  );
};

export default Header;

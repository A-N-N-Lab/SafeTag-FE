import React from 'react';
import styled from 'styled-components';

const MartContainer = styled.div`
  background-color: #ffffff; 
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 20px; 
  text-align: left; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  width: 200px;
  height: 150px; 
  margin: 0px auto;
`;

const Title = styled.h2`
  color: rgb(0, 0, 0);
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MartButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  padding: 5px 10px; 
  width: 100px;  /* 너비를 넓게 지정 */
  border: none; 
  border-radius: 10px; 
  background-color: #ffffff; 
  color: rgb(0, 0, 0);
  cursor: pointer; 
  transition: background-color 0.3s; 
  font-size: 14px;
`;

const ButtonIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
`;

const Mart = () => {
  return (
    <MartContainer>
      <Title>이벤트 탐지</Title>
      <ButtonGroup>
        <MartButton>
          <ButtonIcon src="/cctv-icon.png" alt="receipt" />
          CCTV
        </MartButton>
        <MartButton>
          <ButtonIcon src="/cadan-icon.png" alt="card" />
          차단기
        </MartButton>
      </ButtonGroup>
    </MartContainer>
  );
};

export default Mart;

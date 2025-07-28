import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MgmtContainer = styled.div`
  background-color: #ffffff; 
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 30px; 
  text-align: left; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  width: 350px;
  height: 150px; 
  margin: 20px auto;
`;

const Title = styled.h2`
  color: rgb(0, 0, 0);
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MgmtButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  padding: 5px;
  border: none; 
  border-radius: 10px; 
  background-color: #ffffff; 
  color: rgb(0, 0, 0);
  cursor: pointer; 
  transition: background-color 0.3s; 

  &:hover {
    background-color: #d5d5d5;
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
`;

const Mgmt = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/Auth');
  };

  return (
    <MgmtContainer>
      <Title>차량 관리</Title>
      <ButtonGroup>
        <MgmtButton onClick={handleAuthClick}>
          <ButtonIcon src="/auth-icon.png" alt="Auth" />
          권한 인증
        </MgmtButton>
        <MgmtButton>
          <ButtonIcon src="/callcen-icon.png" alt="Callcen" /> 
          고객센터
        </MgmtButton>
      </ButtonGroup>
    </MgmtContainer>
  );
};

export default Mgmt;

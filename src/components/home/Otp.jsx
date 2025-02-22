import React from 'react';
import styled from 'styled-components';

const OtpContainer = styled.div`
  background-color: #6B89B9; 
  border: 1px solid #6B89B9;
  border-radius: 10px;
  padding: 30px; 
  text-align: left; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  width: 380px;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: white;
`;

const OtpInputs = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const OtpInput = styled.input`
  width: 40px; 
  height: 50px; 
  text-align: center; 
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  font-size: 18px; 
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center; 
  margin-top: 10px;
`;

const OtpButton = styled.button`
  width: 180px; 
  height: 40px; 
  border: none; 
  border-radius: 25px;
  background-color: #ccc;
  color: black;
  font-size: 18px; 
  cursor: pointer; 
  margin: 0px 10px; 
  transition: background-color 0.3s;

  &:hover {
    background-color: #7d7d7d;
  }
`;

const Otp = () => {
  return (
    <OtpContainer>
      <Title>OTP를 입력하여 연락하기</Title>
      <OtpInputs>
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <OtpInput
              key={index}
              type="text"
              maxLength="1"
            />
          ))}
      </OtpInputs>
      <ButtonGroup>
        <OtpButton>음성 통화</OtpButton>
        <OtpButton>메시지</OtpButton>
      </ButtonGroup>
    </OtpContainer>
  );
};

export default Otp;

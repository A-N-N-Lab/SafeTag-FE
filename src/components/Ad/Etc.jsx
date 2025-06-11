import React from 'react';
import styled from 'styled-components';

const EtcContainer = styled.div`
  background-color: #6B89B9; 
  border: 1px solid #6B89B9;
  border-radius: 10px;
  padding: 20px; 
  text-align: left; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  width: 130px;
  height: 150px; 
  margin: 0px auto;
`;

const Title = styled.h2`
  color: rgb(0, 0, 0);
`;

const Etc = () => {
  return (
    <EtcContainer>
      <Title>기타</Title>
    </EtcContainer>
  );
};

export default Etc;

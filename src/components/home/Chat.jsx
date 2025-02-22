import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex; 
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #ffffff; 
  max-width: 420px; 
  width: 100%;
  margin: 10px auto;
`;

const ChatInput = styled.input`
  background-color: #ffffff;
  border: none; 
  outline: none; 
  padding: 5px; 
  flex: 1;
  font-size: 16px;
  margin: 0 10px;
`;

const Icon = styled.img`
  width: 25px; 
  height: 25px;
`;

const Chat = () => {
  return (
    <ChatContainer>
      <Icon src="/search-icon.png" alt="Search" /> {''}
      <ChatInput className="chat-input" placeholder="챗봇에게 물어보세요!" />
      <Icon src="/mic-icon.png" alt="Microphone" /> {''}
    </ChatContainer>
  );
};

export default Chat;

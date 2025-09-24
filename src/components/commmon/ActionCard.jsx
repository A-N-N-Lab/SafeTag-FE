//기존 mart 컴포넌트 - 이벤트 탐지/마트 스마일 카드

import React from "react";
import styled from "styled-components";

const ActionCard = ({ title, actions = [], w, h }) => {
  return (
    <Card w={w} h={h}>
      <Title>{title}</Title>
      <Row>
        {actions.map((a, i) => (
          <Btn key={i} onClick={a.onClick}>
            <Icon src={a.icon} alt={a.label} />
            {a.label}
          </Btn>
        ))}
      </Row>
    </Card>
  );
};

export default ActionCard;

const Card = styled.div`
  background: #fff;
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: ${({ w }) => w || "200px"};
  height: ${({ h }) => h || "150px"};
  margin: 0 auto;
`;
const Title = styled.h2`
  color: #000;
  margin-bottom: 12px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
`;
const Btn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  padding: 5px 10px;
  width: 100px;
  border: none;
  border-radius: 10px;
  background: #fff;
  color: #000;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #f1f1f1;
  }
`;
const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
`;

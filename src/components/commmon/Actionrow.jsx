// 기존 mgmt
import React from "react";
import styled from "styled-components";

const ActionRow = ({ title, buttons = [] }) => {
  return (
    <Wrap>
      {title && <Title>{title}</Title>}
      <Row>
        {buttons.map((b, i) => (
          <LongBtn key={i} onClick={b.onClick}>
            <Text>{b.label}</Text>
            <Icon src={b.icon} alt={b.label} />
          </LongBtn>
        ))}
      </Row>
    </Wrap>
  );
};

export default ActionRow;

const Wrap = styled.div`
  background: #fff;
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 30px;
  margin: 20px auto;
  width: 370px;
`;
const Title = styled.h2`
  color: #000;
  margin-bottom: 20px;
`;
const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
const LongBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 160px;
  padding: 0 25px;
  border: 0;
  border-radius: 25px;
  background: #b0bfcc;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: rgb(122, 134, 144);
  }
`;
const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
const Text = styled.span`
  flex: 1;
  text-align: left;
`;

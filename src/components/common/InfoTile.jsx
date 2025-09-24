//기존 ETC
import React from "react";
import styled from "styled-components";

const InfoTile = ({ title = "기타", bg, w, h, children }) => {
  return (
    <Box bg={bg} w={w} h={h}>
      <Title>{title}</Title>
      {children}
    </Box>
  );
};

export default InfoTile;

const Box = styled.div`
  background-color: ${({ bg }) => bg || "#6B89B9"};
  border: 1px solid ${({ bg }) => bg || "#6B89B9"};
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: ${({ w }) => w || "130px"};
  height: ${({ h }) => h || "150px"};
  margin: 0 auto;
`;
const Title = styled.h2`
  color: #000;
`;

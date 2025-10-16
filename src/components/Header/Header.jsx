import React, { useEffect, useState } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  h1 {
    color: #000;
    text-align: left;
    margin-top: 50px;
    margin-left: 15px;
  }
`;

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const read = () => setUserName(localStorage.getItem("name") || "");
    read();
    window.addEventListener("auth-changed", read);
    return () => window.removeEventListener("auth-changed", read);
  }, []);

  return (
    <HeaderContainer>
      <h1>{userName ? `${userName}님` : "로그인 중..."}</h1>
    </HeaderContainer>
  );
};

export default Header;

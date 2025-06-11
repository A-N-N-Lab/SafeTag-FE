import React, { useState } from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: #ffffff;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;

  &.active .nav-button {
    border-top: 5px solid #6b89b9;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  color: #6b89b9;
  font-size: 13px;
  cursor: pointer;
  padding: 5px;
  text-align: center;

  &:hover {
    background-color: rgb(227, 227, 227);
  }
`;

const NavIcon = styled.img`
  margin-bottom: 5px;
`;

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const menuItems = [
    { label: 'Home', icon: '/menu1.png' },
    { label: 'menu2', icon: '/menu2.png' },
    { label: 'menu3', icon: '/menu3.png' },
    { label: 'Mypage', icon: '/menu4.png' },
  ];

  return (
    <NavbarContainer>
      <NavList>
        {menuItems.map((item, index) => (
          <NavItem key={index} className={activeIndex === index ? 'active' : ''}>
            <NavButton onClick={() => handleClick(index)}>
              <NavIcon src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </NavButton>
          </NavItem>
        ))}
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;

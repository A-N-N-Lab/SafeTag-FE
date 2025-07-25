import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
const NavbarContainer = styled.nav`
  background-color: #ffffff;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
`;

const NavList = styled.ul`
  display: flex;
  width: 100%;
  max-width: 500px; /* 최대 너비 제한, 깔끔한 배치 */
  justify-content: space-around;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const NavItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color 0.2s;

  /* 선택되었을 때 선을 보여줌: 여기서 수정 */
  border-top: ${(props) => (props.isActive ? '3px solid #0066ff' : 'none')};
  /* 또는 border-bottom 사용 가능 */

  &:hover {
    background-color: rgb(227, 227, 227);
  }
`;

const NavIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const LabelText = styled.span`
  margin-top: 4px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: #6b89b9;
  ${(props) => (props.show && (props.isActive || props.isHovered) ? `
    color: #0066ff;
  ` : `
    display: none;
  `)}
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 얻기

  const [hoverIndex, setHoverIndex] = useState(null);

  const handleClick = (path) => {
    navigate(path);
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const menuItems = [
    { label: 'Home', icon: '/menu1.png', activeIcon: '/menu11.png', path: '/main' },
    { label: 'Sticker', icon: '/menu2.png', activeIcon: '/menu22.png', path: '/Auth' },
    { label: 'QR', icon: '/menu3.png', activeIcon: '/menu33.png', path: '/QR' },
    { label: 'Mypage', icon: '/menu4.png', activeIcon: '/menu44.png', path: '/Mypage' },
  ];

  return (
    <NavbarContainer>
      <NavList>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path; // 현재 주소와 일치하는지 체크
          const isHovered = hoverIndex === index;
          return (
            <NavItem key={index}>
              <NavButton
                onClick={() => handleClick(item.path)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                isActive={isActive}
              >
                <NavIcon
                  src={isActive || isHovered ? item.activeIcon : item.icon}
                  alt={item.label}
                />
                <LabelText show={true} isActive={isActive} isHovered={isHovered}>
                  {item.label}
                </LabelText>
              </NavButton>
            </NavItem>
          );
        })}
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;

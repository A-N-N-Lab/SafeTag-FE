import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0); // 활성화된 메뉴 인덱스 상태

  const handleClick = (index) => {
    setActiveIndex(index); // 클릭한 메뉴의 인덱스를 활성화 상태로 설정
  };

  const menuItems = [
    { label: 'Home', icon: '/menu1.png' }, // public 폴더 안에 있는 경로
    { label: 'menu2', icon: '/menu2.png' }, // public 폴더 안에 있는 경로
    { label: 'menu3', icon: '/menu3.png' }, // public 폴더 안에 있는 경로
    { label: 'Mypage', icon: '/menu4.png' }, // public 폴더 안에 있는 경로
  ];

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item ${activeIndex === index ? 'active' : ''}`}>
            <button onClick={() => handleClick(index)} className="nav-button">
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

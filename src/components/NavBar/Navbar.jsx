// import React, { useState } from "react";
// import styled from "styled-components";
// import { useNavigate, useLocation } from "react-router-dom";

// const Navbar = ({ items = [], showLabels = true }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [hoverIndex, setHoverIndex] = useState(null);

//   // 안전 가드: 배열이 아닐 경우 즉시 빈 배열로
//   const safeItems = Array.isArray(items) ? items : [];

//   return (
//     <Bar>
//       <List>
//         {items.map((item, idx) => {
//           const isActive = item.path
//             ? location.pathname === item.path
//             : activeIndex === idx;
//           const isHover = hoverIndex === idx;

//           const handleClick = () => {
//             if (item.onClick) item.onClick();
//             else if (item.path) navigate(item.path);
//             else setActiveIndex(idx);
//           };

//           return (
//             <Item key={idx}>
//               <Btn
//                 onClick={handleClick}
//                 onMouseEnter={() => setHoverIndex(idx)}
//                 onMouseLeave={() => setHoverIndex(null)}
//                 active={isActive}
//               >
//                 <Icon
//                   src={
//                     (isActive || isHover) && item.activeIcon
//                       ? item.activeIcon
//                       : item.icon
//                   }
//                   alt={item.label}
//                 />
//                 <Label show={showLabels} active={isActive} hover={isHover}>
//                   {item.label}
//                 </Label>
//               </Btn>
//             </Item>
//           );
//         })}
//       </List>
//     </Bar>
//   );
// };

// export default Navbar;

// const Bar = styled.nav`
//   background: #fff;
//   padding: 10px 0;
//   position: fixed;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 1000;
//   display: flex;
//   justify-content: center;
//   box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
// `;
// const List = styled.ul`
//   display: flex;
//   width: 100%;
//   max-width: 500px;
//   justify-content: space-around;
//   margin: 0;
//   padding: 0;
//   list-style: none;
// `;
// const Item = styled.li`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;
// const Btn = styled.button`
//   background: none;
//   border: none;
//   outline: none;
//   cursor: pointer;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 8px 10px;
//   border-radius: 8px;
//   transition: background-color 0.2s;
//   border-top: ${(p) => (p.active ? "3px solid #0066ff" : "none")};
//   &:hover {
//     background-color: rgb(227, 227, 227);
//   }
// `;
// const Icon = styled.img`
//   width: 24px;
//   height: 24px;
// `;
// const Label = styled.span`
//   margin-top: 4px;
//   font-size: 12px;
//   font-family: Arial, sans-serif;
//   color: ${(p) => (p.active || p.hover ? "#0066ff" : "#6b89b9")};
//   ${(p) => (!p.show ? "display:none;" : "")}
// `;

import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarButton from "./NavbarButton";

const NAV_MAX_WIDTH = 500;
const NAV_HEIGHT = 64;

export default function Navbar({ items = [], showLabels = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Bar role="navigation" aria-label="Bottom Navigation">
      <Inner>
        {safeItems.map((item, idx) => {
          const isActive = item?.path
            ? location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/")
            : false;
          const go = () => {
            if (item?.onClick) item.onClick();
            else if (item?.path) navigate(item.path);
          };
          return (
            <NavbarButton
              key={item?.path ?? idx}
              icon={item?.icon}
              activeIcon={item?.activeIcon}
              label={item?.label}
              active={isActive}
              showLabel={showLabels}
              onClick={go}
            />
          );
        })}
      </Inner>
    </Bar>
  );
}

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${NAV_HEIGHT}px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.06);
  z-index: 1000;
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${NAV_MAX_WIDTH}px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 12px;
`;

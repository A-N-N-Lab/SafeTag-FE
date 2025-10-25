import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarButton from "./NavbarButton";

const NAV_MAX_WIDTH = 393;
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
  position: sticky;
  bottom: 0;
  width: 100%;
  height: ${NAV_HEIGHT}px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.06);
  z-index: 10;
  padding-bottom: env(safe-area-inset-bottom);
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${NAV_MAX_WIDTH}px; /* 카드 폭에 맞추기 */
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 12px;
`;

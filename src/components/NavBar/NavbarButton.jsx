import React from "react";
import styled from "styled-components";

export default function NavbarButton({
  icon,
  activeIcon,
  label,
  active = false,
  showLabel = true,
  onClick,
}) {
  const src = active && activeIcon ? activeIcon : icon;

  return (
    <Btn
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      $active={active}
    >
      <Icon src={src} alt={label} draggable={false} />
      <Label $show={showLabel} $active={active}>
        {label}
      </Label>
      <ActiveDot aria-hidden="true" $active={active} />
    </Btn>
  );
}

const Btn = styled.button`
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  border-radius: 12px;
  min-width: 64px;
  position: relative;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  user-select: none;
  pointer-events: none;
`;

const Label = styled.span`
  margin-top: 4px;
  font-size: 11px;
  color: ${(p) => (p.$active ? "#1c6bff" : "#52616b")};
  ${(p) => (!p.$show ? "display:none;" : "")}
`;

const ActiveDot = styled.span`
  position: absolute;
  bottom: -2px;
  width: 18px;
  height: 6px;
  border-radius: 6px;
  background: #1c6bff;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transform: translateY(${(p) => (p.$active ? "0" : "4px")});
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

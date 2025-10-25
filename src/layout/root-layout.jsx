import React, { useMemo } from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import NavBar from "../components/NavBar/Navbar";
import Footer from "../components/Footer/Footer";
import styled, { createGlobalStyle } from "styled-components";
import EnablePushButton from "../components/common/EnablePushButton";

const NAV_HEIGHT = 64;
const FOOTER_HEIGHT = 56; // Footer 실제 높이에 맞게 조정

// NavBar/ Footer를 숨길 경로들
const HIDE_SHELL_ON = [
  "/login",
  "/signup",
  "/start",
  "/logout",
  "/call/*", // 통화 화면은 풀스크린 권장
  "/chatbot",
];

const RootLayout = () => {
  const location = useLocation();

  const hideShell = HIDE_SHELL_ON.some((p) =>
    matchPath({ path: p, end: false }, location.pathname)
  );

  const items = useMemo(
    () => [
      {
        label: "Home",
        icon: "/menu1.png",
        activeIcon: "/menu11.png",
        path: "/main",
      },
      {
        label: "Sticker",
        icon: "/menu2.png",
        activeIcon: "/menu22.png",
        path: "/sticker",
      },
      {
        label: "QR",
        icon: "/menu3.png",
        activeIcon: "/menu33.png",
        path: "/qr",
      },
      {
        label: "Mypage",
        icon: "/menu4.png",
        activeIcon: "/menu44.png",
        path: "/mypage",
      },
    ],
    []
  );

  // Nav + Footer가 보일 때는 가려지지 않도록 내부 컨텐츠에 패딩을 준다
  const padBottom = hideShell ? 0 : NAV_HEIGHT + FOOTER_HEIGHT;

  return (
    <>
      <GlobalStyle />

      {/* 바깥 바탕(회색) */}
      <Viewport>
        {/* 앱 표면(흰색 카드) */}
        <Surface>
          {/* 네비바가 보일 때만 하단 패딩 */}
          <Content $padBottom={hideShell ? 0 : NAV_HEIGHT}>
            <Outlet />
            <EnablePushButton />
          </Content>

          {!hideShell && <NavBar items={items} showLabels />}
        </Surface>
      </Viewport>
    </>
  );
};

export default RootLayout;
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: #ECEFF3;
    height: 100%;
  }
`;

const Viewport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100dvh;
  position: relative;
`;

const Surface = styled.div`
  width: 100%;
  max-width: 393px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: visible;
  padding-bottom: ${NAV_HEIGHT}px;
  box-sizing: border-box;
`;

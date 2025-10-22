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
  // "/admin/*",
  "/call/*", // 통화 화면은 풀스크린 권장
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
          {/* 내부만 스크롤되도록 분리 */}
          <Content $padBottom={padBottom}>
            <Outlet />
            <EnablePushButton />
          </Content>

          {!hideShell && <Footer />}
        </Surface>
      </Viewport>

      {!hideShell && <NavBar items={items} showLabels />}
    </>
  );
};
export default RootLayout;

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  /* 기본 리셋 */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html, body {
    margin: 0;
    overflow-x : hidden;
    background: #ECEFF3; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Viewport = styled.div`
  height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 12px env(safe-area-inset-right) 12px env(safe-area-inset-left);
`;

const Surface = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100dvh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  webkit-overflow-scrolling: touch;
`;

const Content = styled.main`
  flex: 1 0 auto;
  padding: 12px;
  padding-bottom: ${({ $padBottom }) => `${$padBottom}px`};
`;

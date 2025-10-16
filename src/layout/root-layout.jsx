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
  "/admin/*",
  "/call/*", // 통화 화면은 풀스크린 권장
];

export default function RootLayout() {
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

  return (
    <>
      <GlobalStyle />
      <Container $padBottom={hideShell ? 0 : NAV_HEIGHT + FOOTER_HEIGHT}>
        <Outlet />
        <EnablePushButton />
        {!hideShell && <Footer />}
      </Container>
      {!hideShell && <NavBar items={items} showLabels />}
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  /* 가능하면 index.html <link>로 옮기는 걸 권장 */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex; justify-content: center; align-items: flex-start;
    min-height: 100vh;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: rgba(241,241,241,1);
  }
`;

// JS(.jsx)에서는 제네릭/타입 선언 없이 사용
// $ 접두사는 transient prop이라 DOM에 내려가지 않음
const Container = styled.div`
  width: 393px; /* 모바일 기준 폭 고정 */
  min-height: 100vh;
  background: #fff;
  overflow-y: auto;
  margin: 0 auto;
  padding-bottom: ${({ $padBottom }) =>
    `${$padBottom}px`}; /* Nav+Footer 가림 방지 */
`;

// import React from "react";
// import { Outlet, useLocation, matchPath } from "react-router-dom";
// import NavBar from "../components/NavBar/Navbar"; // re-export면 "../components/NavBar" 도 OK
// import Footer from "../components/home/Footer";
// import styled, { createGlobalStyle } from "styled-components";

// const NAV_HEIGHT = 64;

// // 여기 있는 경로들에서는 NavBar를 숨김
// const HIDE_NAV_ON = ["/login", "/signup", "/start", "/logout", "/admin/*"];

// const RootLayout = () => {
//   const location = useLocation();

//   const hideNav = HIDE_NAV_ON.some((p) =>
//     matchPath({ path: p, end: false }, location.pathname)
//   );

//   const items = [
//     {
//       label: "홈",
//       path: "/",
//       icon: "/icons/home.svg",
//       activeIcon: "/icons/home-active.svg",
//     },
//     {
//       label: "QR",
//       path: "/QR",
//       icon: "/icons/qr.svg",
//       activeIcon: "/icons/qr-active.svg",
//     },
//     {
//       label: "마이",
//       path: "/Mypage",
//       icon: "/icons/user.svg",
//       activeIcon: "/icons/user-active.svg",
//     },
//   ];

//   return (
//     <>
//       <GlobalStyle />
//       <Container $withNav={!hideNav}>
//         <Outlet />
//         <Footer />
//       </Container>
//       {!hideNav && <NavBar items={items} showLabels />}
//     </>
//   );
// };

// export default RootLayout;

// const GlobalStyle = createGlobalStyle`
//   @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   body {
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     min-height: 100vh;
//     font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//     background-color: rgba(241, 241, 241, 1);
//   }
// `;

// const Container = styled.div`
//   width: 393px;
//   min-height: 100vh;
//   background-color: #ffffff;
//   overflow-y: auto;
// `;
import React from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import NavBar from "../components/NavBar/Navbar";
import Footer from "../components/Footer/Footer";
import styled, { createGlobalStyle } from "styled-components";

const NAV_HEIGHT = 64;
const HIDE_NAV_ON = ["/login", "/signup", "/start", "/logout", "/admin/*"];

export default function RootLayout() {
  const location = useLocation();
  const hideNav = HIDE_NAV_ON.some((p) =>
    matchPath({ path: p, end: false }, location.pathname)
  );

  // 팀원이 준 아이템 그대로 사용 (아이콘은 public/ 경로 기준)
  const items = [
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
      path: "/Auth",
    },
    { label: "QR", icon: "/menu3.png", activeIcon: "/menu33.png", path: "/QR" },
    {
      label: "Mypage",
      icon: "/menu4.png",
      activeIcon: "/menu44.png",
      path: "/Mypage",
    },
  ];

  return (
    <>
      <GlobalStyle />
      <Container $withNav={!hideNav}>
        <Outlet />
        <Footer />
      </Container>

      {!hideNav && <NavBar items={items} showLabels />}
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex; justify-content: center; align-items: flex-start;
    min-height: 100vh;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: rgba(241,241,241,1);
  }
`;

const Container = styled.div`
  width: 393px; /* 모바일 디자인 폭 */
  min-height: 100vh;
  background: #fff;
  overflow-y: auto;
  padding-bottom: ${(p) =>
    p.$withNav ? `${NAV_HEIGHT}px` : 0}; /* 가림 방지 */
  margin: 0 auto;
`;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SignUp from "./pages/SignUpPage";
import SignupSelect from "./pages/SignupSelectPage";
import NotFound from "./pages/NotFoundPage";
import StartPage from "./pages/StartPage";
import Home from "./pages/homePage";
import MyPage from "./pages/MyPage";
import Auth from "./pages/AuthPage";
import Sticker from "./pages/StickerPage";
import QRPage from "./pages/QRPage";
import Chatbot from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/helpers";
import Logout from "./pages/LogoutPage";
import Adminpage from "./pages/AdminPage";
import ScanResultPage from "./pages/ScanResultPage";
import CallPage from "./pages/CallPage";

// 서비스워커 메시지를 처리하는 컴포넌트
function FcmMessageListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const onSwMsg = (event) => {
      if (event.data?.type === "OPEN_CALL" && event.data.sessionId) {
        navigate(`/call/${event.data.sessionId}`);
      }
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSwMsg);
    }

    // onMessage에서 CustomEvent("FCM_OPEN_CALL") 쏜 경우도 처리 (포그라운드 클릭)
    const onCustom = (e) => {
      const sid = e.detail?.sessionId;
      if (sid) navigate(`/call/${sid}`);
    };
    window.addEventListener("FCM_OPEN_CALL", onCustom);

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSwMsg);
      }
      window.removeEventListener("FCM_OPEN_CALL", onCustom);
    };
  }, [navigate]);

  return null;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <FcmMessageListener />
          <RootLayout />
        </>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <PublicOnlyRoute>
              <StartPage />
            </PublicOnlyRoute>
          ),
        },
        // 선택 페이지
        {
          path: "signup/select",
          element: (
            <PublicOnlyRoute>
              <SignupSelect />
            </PublicOnlyRoute>
          ),
        },
        {
          path: "signup/user",
          element: (
            <PublicOnlyRoute>
              <SignUp mode="user" />
            </PublicOnlyRoute>
          ),
        },
        {
          path: "signup/admin",
          element: (
            <PublicOnlyRoute>
              <SignUp mode="admin" />
            </PublicOnlyRoute>
          ),
        },
        {
          path: "main",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "mypage",
          element: (
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin",
          element: <Adminpage />,
        },
        {
          path: "auth",
          element: <Auth />,
        },
        {
          path: "sticker",
          element: <Sticker />,
        },
        {
          // 내 QR (차주) - 보호
          path: "qr",
          element: <QRPage />,
        },

        {
          path: "login",
          element: (
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          ),
        },
        {
          path: "logout",
          element: <Logout />,
        },
        {
          path: "chatbot",
          element: <Chatbot />,
        },
        {
          path: "scan",
          element: <ScanResultPage />,
        },
        {
          path: "qr/:uuid",
          element: <ScanResultPage />,
        },
        {
          path: "call/:sessionId",
          element: <CallPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

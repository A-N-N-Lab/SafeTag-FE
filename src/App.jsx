import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUpPage";
import SignupSelect from "./pages/SignupSelectPage";
import NotFound from "./pages/NotFoundPage";
import StartPage from "./pages/StartPage";
import Home from "./pages/homePage";
import MyPage from "./pages/MyPage";
import Auth from "./pages/AuthPage";
import Sticker from "./pages/StickerPage";
import QR from "./pages/QRPage";
import Chatbot from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/helpers";
import Logout from "./pages/LogoutPage";
import Adminpage from "./pages/Adminpage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
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
          path: "Mypage",
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
          path: "qr",
          element: <QR />,
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
         path: "Chatbot",
         element: <Chatbot/>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

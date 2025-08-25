import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUp";
import SignupSelect from "./pages/SignupSelect";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import Home from "./pages/home";
import MyPage from "./pages/MyPage";
import Ad from "./pages/Ad";
import Auth from "./pages/Auth";
import Sticker from "./pages/Sticker";
import QR from "./pages/QR";
// import Chatbot from "./pages/Chat";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/helpers";
import Logout from "./pages/Logout";

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
          element: <Ad />,
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
        // {
        //   path: "Chatbot",
        //   element: <Chatbot/>,
        // },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

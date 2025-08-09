import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import Home from "./pages/home";
import MyPage from "./pages/MyPage";
import Ad from "./pages/Ad";
import Auth from "./pages/Auth";
import Sticker from "./pages/Sticker";
import QR from "./pages/QR";
import Navbar from "./components/home/Navbar";
// import Chatbot from "./pages/Chatbot";
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
        {
          path: "signup",
          element: (
            <PublicOnlyRoute>
              <SignUp />
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
          element: <MyPage />,
        },
        {
          path: "ad",
          element: <Ad />,
        },
        {
          path: "Auth",
          element: <Auth />,
        },
        {
          path: "Sticker",
          element: <Sticker />,
        },
        {
          path: "QR",
          element: <QR />,
        },
        {
          path: "Navbar",
          element: <Navbar />,
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
        //   element: <Chatbot />,
        // },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

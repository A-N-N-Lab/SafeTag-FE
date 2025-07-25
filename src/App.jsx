import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import Home from "./pages/home";
import MyPage from "./pages/MyPage";
import Ad from "./pages/Ad";
import Auth from "./pages/Auth";
import Sticker from "./pages/Sticker"
import QR from "./pages/QR"
import Navbar from './components/home/Navbar';


function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <StartPage />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
        {
          path: "main",
          element: <Home />,
        },
        {
          path: "Mypage",
          element: <MyPage />,
        },
        {
          path: "Ad",
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

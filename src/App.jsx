import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import Home from "./pages/home";
import MyPage from "./components/My";
import Ad from "./pages/Ad";

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
          path: "mypage",
          element: <MyPage />,
        },
        {
          path: "Ad",
          element: <Ad />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

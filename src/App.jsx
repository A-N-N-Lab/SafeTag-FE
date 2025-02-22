import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import Home from "./pages/Home";
import MyPage from "./components/My";

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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

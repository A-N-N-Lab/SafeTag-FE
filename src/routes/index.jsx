import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root-layout";
import LoginPage from "../pages/LoginPage";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ChatbotPage from "../pages/ChatbotPage";
import CallPage from "../pages/CallPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <UserDashboard /> },
          { path: "/chatbot", element: <ChatbotPage /> },
          { path: "/call/:sessionId", element: <CallPage /> },
          {
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [{ path: "/admin", element: <AdminDashboard /> }],
          },
        ],
      },
    ],
  },
]);

export default router;

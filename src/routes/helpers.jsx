import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) =>
  localStorage.getItem("access_token") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );

export const PublicOnlyRoute = ({ children }) =>
  localStorage.getItem("access_token") ? (
    <Navigate to="/main" replace />
  ) : (
    children
  );

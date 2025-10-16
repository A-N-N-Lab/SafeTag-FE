import { Navigate } from "react-router-dom";

// 로그인된 사용자만 접근 가능 (토큰 없으면 /login)
export const ProtectedRoute = ({ children }) =>
  localStorage.getItem("access_token") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );

// 로그인 상태면 접근 불가 (이미 로그인되어 있으면 /main으로 리다이렉트)
export const PublicOnlyRoute = ({ children }) =>
  localStorage.getItem("access_token") ? (
    <Navigate to="/main" replace />
  ) : (
    children
  );

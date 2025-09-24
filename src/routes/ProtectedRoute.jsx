import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return null; // 스피너 등
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/hook/useAuth";

export function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

import { Navigate, Outlet } from "react-router-dom";
import { useMsalAuth } from "./use-msal-auth";

export function PrivateMsalRoute() {
  const { isAuthenticated } = useMsalAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

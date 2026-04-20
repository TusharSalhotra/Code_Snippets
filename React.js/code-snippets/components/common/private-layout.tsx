import { Navigate, Outlet } from "react-router-dom";

export function PrivateLayout() {
  // TODO: Implement authentication logic
  const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

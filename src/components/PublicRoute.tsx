import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = () => {
  const user = useAuthStore((s) => s.user);

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
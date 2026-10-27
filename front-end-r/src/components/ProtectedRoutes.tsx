import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { AppLoading } from "./app-loading";

export default function ProtectedRoutes({
  adminOnly = false,
}: {
  adminOnly?: boolean;
}) {
  const { user, fetchState } = useAuth();
  const location = useLocation();
  if (fetchState === "notReady") return <AppLoading />;
  if (!user)
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

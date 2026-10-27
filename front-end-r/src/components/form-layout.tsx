import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authDestination } from "../lib/auth-destination";
import { useAuth } from "../provider/AuthProvider";
import { AppLoading } from "./app-loading";

export default function FormLayout() {
  const { user, fetchState } = useAuth();
  const location = useLocation();
  if (fetchState === "notReady") return <AppLoading />;
  if (user)
    return <Navigate to={authDestination(user, location.search)} replace />;
  return <Outlet />;
}

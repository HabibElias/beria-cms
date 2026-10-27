import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { AppLoading } from "./app-loading";

export default function FormLayout() {
  const { user, fetchState } = useAuth();
  if (fetchState === "notReady") return <AppLoading />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

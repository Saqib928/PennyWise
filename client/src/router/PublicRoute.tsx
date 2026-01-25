import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function PublicRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If not logged in, redirect to login page, but save the current location
  // so we can redirect them back after they login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the child route
  return <Outlet />;
}
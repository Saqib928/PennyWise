import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import GroupDetails from "../pages/GroupDetails";
import Users from "../pages/Users";
import MainLayout from "../components/layouts/MainLayout";
import Notifications from "../pages/Notifications";
import CreateGroup from "../pages/CreateGroup";
import ProtectedRoute from "../router/ProtectedRoute";
import PublicRoute from "../router/PublicRoute";

export const router = createBrowserRouter([
  // --- Public Routes (Login/Register) ---
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // --- Protected Routes ---
  {
    element: <ProtectedRoute />, // 1. Check Auth
    children: [
      {
        // 2. Apply Layout to all children
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          // 3. Render specific pages
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/groups", element: <Groups /> },
          { path: "/groups/new", element: <CreateGroup /> },
          { path: "/groups/:id", element: <GroupDetails /> },
          { path: "/users", element: <Users /> },
          { path: "/notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  // --- Fallback ---
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <div className="p-10 text-center">404 - Page Not Found</div>,
  },
]);
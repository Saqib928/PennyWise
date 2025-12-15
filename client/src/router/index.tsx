import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import GroupDetails from "../pages/GroupDetails";
import Users from "../pages/users";
import MainLayout from "../components/layouts/MainLayout";
import Notifications from "../pages/Notifications";
import CreateGroup from "../pages/CreateGroup";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/dashboard",
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },

  {
    path: "/groups",
    element: (
      <MainLayout>
        <Groups />
      </MainLayout>
    ),
  },

  {
    path: "/groups/:id",
    element: (
      <MainLayout>
        <GroupDetails />
      </MainLayout>
    ),
  },

  {
    path: "/users",
    element: (
      <MainLayout>
        <Users />
      </MainLayout>
    ),
  },

  {
    path: "/notifications",
    element: (
      <MainLayout>
        <Notifications />
      </MainLayout>
    ),
  },

  {
    path: "/groups/new",
    element: (
      <MainLayout>
        <CreateGroup />
      </MainLayout>
    ),
  },
]);

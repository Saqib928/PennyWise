import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import UserProfileMenu from "./UserProfileMenu";
import { useNotifications } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Menu className="w-6 h-6" />
        </button>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
        >
          <Bell className="w-6 h-6" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* User Info + Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>

          <UserProfileMenu />
        </div>

      </div>
    </header>
  );
}

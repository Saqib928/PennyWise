import UserProfileMenu from "./UserProfileMenu";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Example unseen notifications count (you can replace with API)
  const unseenCount = 3;

  return (
    <nav className="fixed top-0 left-64 right-0 h-16 bg-white px-6 shadow flex items-center justify-between z-40">
      <h1 className="text-xl font-bold">PennyWise</h1>

      <div className="flex items-center gap-6">

        {/* Bell Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 17h5l-1.405-1.405A2.032 2.032 0 0117 14.158V11a5.002 
              5.002 0 00-4-4.9V5a2 2 0 10-4 0v1.1A5.002 5.002 0 005 11v3.159c0 .538-.214 
              1.055-.595 1.436L3 17h5m6 0v1a3 3 0 11-6 0v-1h6z"
            />
          </svg>

          {/* Unseen Notification Count */}
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
              {unseenCount}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <UserProfileMenu />
      </div>
    </nav>
  );
}

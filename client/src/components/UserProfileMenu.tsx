import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserProfileMenu() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null; // <-- PREVENT WHITE SCREEN

  return (
    <div className="relative">
      {/* Avatar */}
      <img
        src="/avatar.png"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg p-4 z-50">

          <p className="font-semibold text-lg">
            {user.name}
          </p>

          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.country}</p>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

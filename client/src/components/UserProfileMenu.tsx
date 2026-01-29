import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function UserProfileMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await api.get("/auth/me");
      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (e) {
      console.error("Failed to load user", e);
    }
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!user) return null;

  const initial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>

      {/* Initial Avatar */}
      <div
        onClick={() => setOpen(prev => !prev)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold cursor-pointer shadow"
      >
        {initial}
      </div>

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-xl p-4 z-50 border border-gray-100">

          <div className="flex flex-col items-center text-center">

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {initial}
            </div>

            <p className="mt-2 font-semibold text-gray-900 text-sm">
              {user.name}
            </p>

            {user.username && (
              <p className="text-indigo-600 text-xs font-medium">
                @{user.username}
              </p>
            )}

            <p className="text-gray-500 text-xs mt-1 truncate max-w-full">
              {user.email}
            </p>

            <p className="text-gray-400 text-[11px] mt-1 uppercase tracking-wide">
              {user.country || "Global"}
            </p>

          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}

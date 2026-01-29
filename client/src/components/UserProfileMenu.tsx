import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";

export default function UserProfileMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Fetch User Data
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await api.get("/auth/me");
      // Check for nested structure: { data: { id, name... } }
      if (res.data?.data) {
        setUser(res.data.data);
      } else if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (e) {
      console.error("Failed to load user", e);
    }
  }

  // 2. Close menu on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 3. Logout Handler (FIXED)
  const handleLogout = async () => {
    try {
        // Call backend to clear httpOnly cookie
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        // Clear any client-side state/storage
        localStorage.clear();
        
        // FORCE RELOAD to Login Page
        // Using window.location.href instead of navigate ensures a full state reset
        window.location.href = "/login";
    }
  };

  if (!user) return null;

  const initial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>

      {/* Avatar Button */}
      <div
        onClick={() => setOpen(prev => !prev)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold cursor-pointer shadow hover:shadow-md transition-shadow"
      >
        {initial}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-2xl p-5 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">

          <div className="flex flex-col items-center text-center">
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-sm">
              {initial}
            </div>

            <p className="font-bold text-gray-900 text-lg leading-tight">
              {user.name}
            </p>

            <p className="text-gray-500 text-sm mt-1 truncate w-full px-2">
              {user.email}
            </p>

            <div className="mt-3 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                {user.country || "India"}
                </p>
            </div>

          </div>

          <hr className="my-4 border-gray-100" />

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import UserProfileMenu from "./UserProfileMenu";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const navigate = useNavigate();
  
  // Get the dynamic count from the Context
  const { unreadCount } = useNotifications(); 

  return (
    // Sticky top, glass effect
    <header className="sticky top-0 z-10 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between transition-all duration-300">
      
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Modern Search Bar */}
        <div className="hidden md:flex items-center bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl px-4 py-2.5 w-64 lg:w-96 transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-50 focus-within:bg-white focus-within:border-indigo-100 group">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors mr-3" />
            <input 
                type="text" 
                placeholder="Search for expenses, friends..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
            />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Notification Bell Logic */}
        <button 
            onClick={() => navigate("/notifications")}
            className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 group"
        >
          <Bell className="w-6 h-6" />
          
          {/* Only show badge if count > 0 */}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white shadow-sm transform translate-x-1 -translate-y-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        {/* User Menu Trigger */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-none">Mohd Saqib</p>
                <p className="text-xs text-gray-400 mt-1">Free Plan</p>
            </div>
            <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
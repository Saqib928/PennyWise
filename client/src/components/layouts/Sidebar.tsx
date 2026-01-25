import { Link, useLocation } from "react-router-dom";
import { Wallet, PieChart, Activity, Users } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <PieChart size={20} /> },
    { name: "Groups", path: "/groups", icon: <Activity size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col shadow-sm z-20 h-screen sticky top-0">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
             <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">PennyWise</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm translate-x-1"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Pro Plan Badge */}
      <div className="p-4 border-t border-gray-50 mt-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 group cursor-pointer transition-transform hover:scale-[1.02]">
            {/* Abstract Shapes for Modern Look */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-black/10 rounded-full blur-lg -ml-6 -mb-6"></div>
            
            <p className="text-xs font-medium text-indigo-100 mb-1">Current Plan</p>
            <p className="text-lg font-bold mb-3">Pro Access</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm transition-colors border border-white/10">
                Upgrade Now
            </button>
        </div>
      </div>
    </aside>
  );
}
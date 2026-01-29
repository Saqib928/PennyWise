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

    </aside>
  );
}
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Groups", path: "/groups" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white shadow-lg p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">PennyWise</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg text-sm font-medium hover:bg-gray-100 
              ${location.pathname === item.path ? "bg-gray-200" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

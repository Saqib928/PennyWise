import { useState, useEffect } from "react";
import { Search, MapPin, Mail, Loader2, User as UserIcon, AlertCircle } from "lucide-react";
import { api } from "../services/api"; // Importing api instance directly for flexible endpoints

interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        let response;
        
        // Conditional Logic for Endpoints
        if (searchTerm.trim()) {
            // 1. Search API
            response = await api.get(`/users/search?q=${searchTerm}`);
        } else {
            // 2. All Users API (Default)
            response = await api.get("/users/users");
        }

        if (response.data.success) {
          setUsers(response.data.data || []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        // Optional: only show error if it's not a 404 on search
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce logic: 
    // If searchTerm is empty (initial load), fetch immediately (delay 0).
    // If typing, wait 400ms to avoid API spam.
    const delay = searchTerm ? 400 : 0;
    
    const timer = setTimeout(() => {
        fetchUsers();
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
      
      {/* --- Header & Search Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Community</h1>
          <p className="text-gray-500 mt-2">Discover members and friends.</p>
        </div>

        {/* Modern Search Bar */}
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* --- Error State --- */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* --- Content Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Decorative Background Blur */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-t-2xl z-0"></div>

            {/* Avatar */}
            <div className="relative z-10 -mt-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* User Info */}
            <div className="relative z-10 mt-4 space-y-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {user.name}
                </h3>
                
                <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{user.country || "Global"}</span>
                </div>
            </div>

            {/* Action Button */}
            <button className="relative z-10 mt-6 w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                View Profile
            </button>
          </div>
        ))}
      </div>

      {/* --- Empty States --- */}
      {!loading && users.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No users found
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            {searchTerm ? "We couldn't find anyone matching your search." : "No users in the directory yet."}
          </p>
        </div>
      )}
    </div>
  );
}
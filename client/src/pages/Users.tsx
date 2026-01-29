import { useState, useEffect } from "react";
import { Search, MapPin, Mail, Loader2, User as UserIcon, AlertCircle, AtSign } from "lucide-react";
import { api } from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  username?: string;
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

        if (searchTerm.trim()) {
          response = await api.get(`/users/search?q=${searchTerm}`);
        } else {
          response = await api.get("/users/users");
        }

        if (response.data.success) {
          setUsers(response.data.data || []);
        }

      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    const delay = searchTerm ? 400 : 0;
    const timer = setTimeout(fetchUsers, delay);

    return () => clearTimeout(timer);

  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-500 mt-2">Discover members and friends.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-3 h-5 w-5 text-indigo-500 animate-spin" />
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                {user.name}
              </h3>

              {user.username && (
                <div className="flex items-center justify-center gap-1 text-indigo-600 text-sm font-semibold">
                  <AtSign className="w-3 h-3" />
                  {user.username}
                </div>
              )}

              <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 uppercase pt-1">
                <MapPin className="w-3 h-3" />
                {user.country || "Global"}
              </div>
            </div>
          </div>
        ))}

      </div>

      {!loading && users.length === 0 && (
        <div className="text-center py-20">
          <UserIcon className="mx-auto text-gray-300 w-8 h-8" />
          <h3 className="text-lg font-medium text-gray-900 mt-2">
            No users found
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {searchTerm ? "No matching users found." : "No users yet."}
          </p>
        </div>
      )}

    </div>
  );
}

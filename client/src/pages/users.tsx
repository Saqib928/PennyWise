import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { api } from "../services/api"; // Assuming you have this set up

// Define the User type based on your API response
interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Calling the API endpoint (adjust URL if needed, e.g., /users)
        const response = await api.get("/users/search?q="); 
        // Or if you have a specific get all endpoint: await api.get("/users");
        
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (err: any) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Users Directory</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div key={u._id} className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-sm">
                <span className="text-gray-600">📍 {u.country || "Unknown"}</span>
                <span className="text-gray-400 text-xs">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-10">No users found.</p>
        )}
      </div>
    </div>
  );
}
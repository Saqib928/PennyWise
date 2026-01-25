import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import { GroupService } from "../services/groups.service";
import { UsersService } from "../services/users.service";
import type { User } from "../types/user.types";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setFilteredUsers([]);
        return;
      }

      try {
        const response = await UsersService.searchUsers(searchQuery);
        if (response.data.success && response.data.data) {
          // Filter out already selected users
          const selected = selectedUsers.map(u => u._id || u.id);
          const available = response.data.data.filter(u => !selected.includes(u._id || u.id));
          setFilteredUsers(available);
        }
      } catch (err) {
        console.error("Error searching users:", err);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedUsers]);

  const addMember = (user: User) => {
    if (!selectedUsers.find(u => (u._id || u.id) === (user._id || user.id))) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery("");
      setFilteredUsers([]);
    }
  };

  const removeMember = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => (u._id || u.id) !== userId));
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please add at least one member");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const memberIds = selectedUsers.map(u => u._id || u.id || "");
      const response = await GroupService.create({
        name: groupName,
        memberIds,
      });

      if (response.data.success) {
        navigate("/groups");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Group</h1>
          <p className="text-gray-500 mb-8">Organize expenses with friends and family</p>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Group Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Group Name</label>
            <input
              type="text"
              placeholder="e.g., Goa Trip, Flat Expenses, Office Lunch"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg"
            />
          </div>

          {/* Add Members */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Add Members</label>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email (minimum 2 characters)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Search Results */}
            {filteredUsers.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 max-h-72 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user._id || user.id}
                    onClick={() => addMember(user)}
                    className="w-full px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 text-left transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-indigo-600">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-indigo-600 font-semibold group-hover:scale-110 transition-transform">+</span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Members */}
            {selectedUsers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Selected Members ({selectedUsers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id || user.id}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium"
                    >
                      {user.name}
                      <button
                        onClick={() => removeMember(user._id || user.id || "")}
                        className="hover:text-indigo-900 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createGroup}
              disabled={loading || !groupName.trim() || selectedUsers.length === 0}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

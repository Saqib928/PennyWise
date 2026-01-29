import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Loader2, Check, Users } from "lucide-react";
import { GroupService } from "../services/groups.service";
import { UsersService } from "../services/users.service";
import type { User } from "../types/user.types";

export default function CreateGroup() {
  const navigate = useNavigate();
  
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Search Users Effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
    }

    const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
            const response = await UsersService.searchUsers(searchQuery);
            if (response.data.success) {
                // Filter out users already selected
                const selectedIds = new Set(selectedUsers.map(u => u._id || u.id));
                const results = response.data.data || [];
                const available = results.filter((u: User) => !selectedIds.has(u._id || u.id));
                setSearchResults(available);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedUsers]);

  const addUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery(""); 
    setSearchResults([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => (u._id || u.id) !== userId));
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
        setError("Group name is required.");
        return;
    }
    if (selectedUsers.length === 0) {
        setError("Please add at least one member.");
        return;
    }

    setSubmitting(true);
    setError("");

    try {
        const payload = {
            name: groupName,
            memberIds: selectedUsers.map(u => u._id || u.id || "") 
        };

        const response = await GroupService.create(payload);

        // Robust check: Success flag OR status code 200/201
        if ( response.status === 201 || response.status === 200) {
            navigate("/groups");
        } else {
            setError("Server processed request but returned unexpected status.");
        }
    } catch (err: any) {
        console.error("Create group error:", err);
        setError(err.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* UI FIX: Max width md (medium) prevents it from being 'vast' */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50 bg-white sticky top-0 z-10 flex items-center gap-3">
            <button 
                onClick={() => navigate("/groups")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">New Group</h1>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Group Name */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Group Name</label>
                <input 
                    type="text" 
                    placeholder="e.g. Goa Trip 🌴"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                    autoFocus
                />
            </div>

            {/* Add Members */}
            <div className="relative">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Members ({selectedUsers.length})</label>
                </div>
                
                {/* Selected Users Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedUsers.map(user => (
                        <div key={user._id || user.id} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium animate-in zoom-in duration-200">
                            <span className="truncate max-w-[100px]">{user.name}</span>
                            <button onClick={() => removeUser(user._id || user.id!)} className="hover:text-indigo-900 p-0.5 rounded-full">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                    {isSearching ? (
                        <div className="absolute right-3 top-3">
                            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        </div>
                    ) : searchQuery.length > 0 && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Dropdown Results */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-20">
                        {searchResults.map(user => (
                            <button 
                                key={user._id || user.id}
                                onClick={() => addUser(user)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Check className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                )}
                
                {selectedUsers.length === 0 && searchQuery.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl mt-2 bg-gray-50/50">
                        <Users className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Search to add people</p>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-50 flex gap-3 sticky bottom-0 z-10">
            <button 
                onClick={() => navigate("/groups")}
                className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleCreate}
                disabled={submitting || !groupName.trim() || selectedUsers.length === 0}
                className="flex-[2] py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Group"}
            </button>
        </div>

      </div>
    </div>
  );
}
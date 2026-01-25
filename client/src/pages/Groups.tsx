import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Users, ArrowRight, Wallet } from "lucide-react";
import { GroupService } from "../services/groups.service";
import { UsersService } from "../services/users.service";
import type { Group } from "../types/group.types";
import type { User } from "../types/user.types";

export default function Groups() {
  const navigate = useNavigate();
  
  // -- State --
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Group Creation State
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [filteredSearchUsers, setFilteredSearchUsers] = useState<User[]>([]);

  // Data State
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -- Effects --

  // 1. Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await GroupService.getAll();
        if (response.data.success && response.data.data) {
          const groupList = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          setGroups(groupList.map((g: any) => ({
            _id: g._id,
            id: g.id,
            name: g.name,
            members: g.members || [],
            createdBy: g.createdBy,
            createdAt: g.createdAt,
            lastActive: "Today", 
            category: "General",
            totalExpense: 0
          })));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // 2. Search users for "Add Members" modal
  useEffect(() => {
    const searchUser = async () => {
      if (searchUsers.length < 2) {
        setFilteredSearchUsers([]);
        return;
      }

      try {
        const response = await UsersService.searchUsers(searchUsers);
        if (response.data.success && response.data.data) {
          setFilteredSearchUsers(response.data.data);
        }
      } catch (err) {
        console.error("Error searching users:", err);
      }
    };

    const timeoutId = setTimeout(() => {
        searchUser();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchUsers]);

  // -- Handlers --

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const response = await GroupService.create({
        name: groupName,
        memberIds: selectedUsers,
      });

      if (response.data.success && response.data.data) {
        const newGroup = response.data.data;
        const groupToAdd: Group = {
          _id: newGroup._id,
          id: newGroup._id,
          name: newGroup.name,
          members: newGroup.members || [],
          createdBy: "Me", 
          createdAt: new Date().toISOString(),
        };
        
        setGroups([groupToAdd, ...groups]);
        
        setIsModalOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        setSearchUsers("");
        
        navigate(`/groups/${newGroup._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create group");
    }
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up p-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Groups</h1>
          <p className="text-gray-500 mt-1">Manage shared expenses with friends & family</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none w-full md:w-64 transition-all"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 font-medium active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Group</span>
          </button>
        </div>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
            ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Link
                key={group._id || group.id}
                to={`/groups/${group._id || group.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
                            {group.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition truncate max-w-[150px]">
                            {group.name}
                        </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <Users className="w-4 h-4" />
                    <span>{group.members?.length || 0} members</span>
                  </div>
                  

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50 text-indigo-600 font-medium group-hover:gap-3 transition-all">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <Users className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No groups found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create your first group
              </button>
            </div>
          )}
        </>
      )}

      {/* --- CREATE GROUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Group</h2>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Group Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g., Goa Trip"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Add Members</label>
              
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {filteredSearchUsers.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 mb-3 bg-gray-50">
                  {filteredSearchUsers.map((u) => {
                    const uid = u._id || u.id || ""; 
                    const isSelected = selectedUsers.includes(uid);
                    
                    return (
                        <div
                        key={uid}
                        onClick={() => toggleUserSelection(uid)}
                        className={`p-3 cursor-pointer rounded-lg flex items-center gap-3 transition-colors ${
                            isSelected ? "bg-indigo-100 border-indigo-200" : "hover:bg-white"
                        }`}
                        >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"}`}>
                            {isSelected && <ArrowRight className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                            <p className={`font-medium text-sm ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                        </div>
                    );
                  })}
                </div>
              )}

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((userId) => {
                    const user = filteredSearchUsers.find(u => (u._id || u.id) === userId);
                    const displayName = user?.name || "User"; 
                    
                    return (
                      <span key={userId} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-2 border border-indigo-100">
                        {displayName}
                        <button
                          onClick={() => toggleUserSelection(userId)}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setGroupName("");
                  setSelectedUsers([]);
                  setSearchUsers("");
                  setFilteredSearchUsers([]);
                }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? "Creating..." : (
                    <>
                        <Plus className="w-4 h-4" />
                        Create Group
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
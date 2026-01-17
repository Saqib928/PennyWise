import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Users, ArrowRight, Wallet } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: number;
  totalExpense: number;
  lastActive: string;
  category: string; // e.g., 'Trip', 'Home', 'Office'
}

interface User {
  id: string;
  name: string;
}

export default function Groups() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock Data
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Goa Trip 🌴", members: 4, totalExpense: 12500, lastActive: "2m ago", category: "Trip" },
    { id: "2", name: "Flat 302 Expenses 🏠", members: 3, totalExpense: 8000, lastActive: "1d ago", category: "Home" },
    { id: "3", name: "Office Lunch 🍔", members: 5, totalExpense: 4500, lastActive: "5h ago", category: "Food" },
  ]);

  const [users] = useState<User[]>([
    { id: "1", name: "Mohd Saqib" },
    { id: "2", name: "Aman Gupta" },
    { id: "3", name: "Ali Khan" },
    { id: "4", name: "Rahul Sharma" }
  ]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: groupName,
      members: selectedUsers.length + 1,
      totalExpense: 0,
      lastActive: "Just now",
      category: "General"
    };
    setGroups([newGroup, ...groups]);
    setIsModalOpen(false);
    setGroupName("");
    setSelectedUsers([]);
    navigate(`/groups/${newGroup.id}`);
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Groups</h1>
          <p className="text-gray-500 mt-1">Manage shared expenses with friends & family</p>
        </div>
        
        <div className="flex gap-3">
          {/* Search Bar */}
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

      {/* --- GROUPS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                 {group.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                {group.lastActive}
              </span>
            </div>

            {/* Card Content */}
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {group.name}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
               <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{group.category}</span>
               <span>•</span>
               <span>{group.members} members</span>
            </div>

            {/* Bottom Row: Stats & Avatar Pile */}
            <div className="flex items-end justify-between border-t border-gray-50 pt-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">₹{group.totalExpense.toLocaleString()}</p>
              </div>
              
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {/* Placeholder avatars */}
                    {["A", "S", "R"][i]}
                  </div>
                ))}
                {group.members > 3 && (
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                     +{group.members - 3}
                   </div>
                )}
              </div>
            </div>
          </Link>
        ))}
        
        {/* Empty State if needed */}
        {filteredGroups.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
                <p>No groups found matching "{searchTerm}"</p>
            </div>
        )}
      </div>

      {/* --- MODERN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a Group</h2>
            <p className="text-gray-500 text-sm mb-6">Start tracking expenses with friends.</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Group Name</label>
                <input
                  type="text"
                  autoFocus
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Goa Trip 2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Add Members</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {users.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                        <div 
                            key={user.id} 
                            onClick={() => toggleUserSelection(user.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                                isSelected 
                                ? "bg-indigo-50 border-indigo-200" 
                                : "bg-white border-gray-100 hover:bg-gray-50"
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                                {isSelected && <ArrowRight className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`font-medium ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>{user.name}</span>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
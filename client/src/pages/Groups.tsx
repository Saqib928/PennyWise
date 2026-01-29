import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Users, ArrowRight, Loader2, AlertCircle, Trash2, X, AlertTriangle } from "lucide-react";
import { GroupService } from "../services/groups.service";
import type { Group } from "../types/group.types";

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Manage which card has the delete confirmation open
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await GroupService.getAll();
      const groupList = response.data.groups || response.data.data || [];
      
      if (Array.isArray(groupList)) {
          setGroups(groupList);
      } else {
          setGroups([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, groupId: any) => {
    e.preventDefault(); 
    e.stopPropagation();
    setConfirmId(groupId);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmId(null);
  };

  const confirmDelete = async (e: React.MouseEvent, groupId: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDeleting(true);
    try {
        const response = await GroupService.delete(groupId);
        if (response.data.success || response.status === 200) {
            setGroups(prev => prev.filter(g => g._id !== groupId));
            setConfirmId(null);
        }
    } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete group");
    } finally {
        setIsDeleting(false);
    }
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up p-6 max-w-7xl mx-auto">
      {/* --- HEADER --- */}
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

          <Link
            to="/groups/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 font-medium active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Group</span>
          </Link>
        </div>
      </div>

      {/* --- ERROR --- */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
                const groupId = group._id || group._id;
                const isConfirming = confirmId === groupId;

                return (
                  <div key={groupId} className="relative group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
                    
                    {/* Main Card Content */}
                    <Link
                        to={`/groups/${groupId}`}
                        className="block p-6 h-full relative z-0 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
                                    {group.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition truncate max-w-[150px]">
                                    {group.name}
                                </h3>
                            </div>
                            
                            {/* Trigger Button with cursor-pointer */}
                            <button 
                                onClick={(e) => handleDeleteClick(e, groupId)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                                title="Delete Group"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                            <Users className="w-4 h-4" />
                            <span>{group.members?.length || 0} members</span>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50 text-indigo-600 font-medium group-hover:gap-3 transition-all">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>

                    {/* --- SLIDE-UP CONFIRMATION OVERLAY --- */}
                    {isConfirming && (
                        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in slide-in-from-bottom-full duration-300 ease-out">
                            <div className="mb-3 p-3 bg-red-100 text-red-600 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h4 className="text-gray-900 font-bold mb-1">Delete Group?</h4>
                            <p className="text-xs text-gray-500 mb-4">This action cannot be undone.</p>
                            
                            <div className="flex gap-2 w-full">
                                {/* Cancel Button with cursor-pointer */}
                                <button 
                                    onClick={handleCancelDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                {/* Confirm Button with cursor-pointer */}
                                <button 
                                    onClick={(e) => confirmDelete(e, groupId)}
                                    disabled={isDeleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-lg shadow-red-100 cursor-pointer"
                                >
                                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
                );
            })}
          </div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <Users className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No groups found</p>
              <Link
                to="/groups/new"
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Create your first group
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
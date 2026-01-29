import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ArrowLeft, Receipt, Users, TrendingUp, Settings, Share2, Plus, Loader2, X, Trash2, Search, UserPlus, ChevronRight, AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { GroupService, type GroupResponse } from "../services/groups.service"; // Import the type
import { ExpenseService } from "../services/expenses.service"; 
import { UsersService } from "../services/users.service";
import type { Expense } from "../types/expense.types";
import type { Group, SettlementBalance } from "../types/group.types";
import type { User } from "../types/user.types";

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Tabs & Loading
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data State
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<SettlementBalance[]>([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [userBalance, setUserBalance] = useState<{ amount: number; status: 'gets' | 'owes' | 'settled' }>({ amount: 0, status: 'settled' });

  // Modals State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAddMemberMode, setIsAddMemberMode] = useState(false);

  // Form States
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [addExpenseLoading, setAddExpenseLoading] = useState(false);

  // Search User State
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState<User[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    if (!id) return;
    try {
        const [groupRes, expensesRes, settlementRes] = await Promise.all([
          GroupService.getOne(id),
          ExpenseService.getByGroup(id), 
          GroupService.getSettlement(id)
        ]);

        // --- 1. ROBUST GROUP FINDING LOGIC ---
        const resData: GroupResponse = groupRes.data;
        let foundGroup: Group | undefined = undefined;

        // Check 1: 'group' (Singular object) - Most direct match
        if (resData.group && !Array.isArray(resData.group)) {
            foundGroup = resData.group;
        }
        // Check 2: 'groups' (Array) - Find by ID or take first
        else if (resData.groups && Array.isArray(resData.groups)) {
            const list = resData.groups as Group[];
            foundGroup = list.find((g) => g._id === id || g.id === id) || list[0];
        }
        // Check 3: 'data' (Could be Array or Object)
        else if (resData.data) {
            if (Array.isArray(resData.data)) {
                const list = resData.data as Group[];
                foundGroup = list.find((g) => g._id === id || g.id === id) || list[0];
            } else {
                foundGroup = resData.data as Group;
            }
        }

        if (foundGroup) {
            setGroup(foundGroup);
        } else {
            console.error("Group Data Missing. Response:", resData);
            setError("Group details not found.");
        }

        // --- 2. Handle Expenses ---
        if (expensesRes.data.success || expensesRes.data.data) {
          const expenseList = Array.isArray(expensesRes.data.data) 
            ? expensesRes.data.data 
            : (expensesRes.data.data as any)?.expenses || [];
            
          setExpenses(expenseList);
          const total = expenseList.reduce((sum: number, ex: any) => sum + Number(ex.price || ex.amount || 0), 0);
          setTotalSpending(total);
        }

        // --- 3. Handle Settlements ---
        if (settlementRes.data.success || settlementRes.data.data) {
          const balanceList = Array.isArray(settlementRes.data.data) ? settlementRes.data.data : [];
          setBalances(balanceList);
          
          if (user) {
            const myBalance = balanceList.find((b: SettlementBalance) => b.userId === user.id || b.userId === user.id);
            if (myBalance) {
                setUserBalance({ amount: Math.abs(myBalance.balance), status: myBalance.status });
            }
          }
        }
    } catch (err: any) {
        console.error("Failed to load details", err);
        setError("Could not load group details.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  // --- SEARCH USERS ---
  useEffect(() => {
    if (memberSearchQuery.trim().length < 2) {
        setMemberSearchResults([]);
        return;
    }
    const timer = setTimeout(async () => {
        setIsSearchingMembers(true);
        try {
            const response = await UsersService.searchUsers(memberSearchQuery);
            if (response.data.success) {
                const currentMemberIds = group?.members.map((m: any) => m._id || m.id) || [];
                const filtered = (response.data.data || []).filter((u: User) => !currentMemberIds.includes(u._id || u.id));
                setMemberSearchResults(filtered);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearchingMembers(false);
        }
    }, 300);
    return () => clearTimeout(timer);
  }, [memberSearchQuery, group]);

  // --- ACTIONS ---
  const handleSettleUp = async () => {
    if (!id || !window.confirm("Are you sure you want to settle all your dues?")) return;
    try {
        const res = await GroupService.settleAll(id);
        if (res.data.success) {
            alert("All dues settled!");
            fetchData();
        }
    } catch (err) {
        alert("Failed to settle dues.");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount || !group || !id) return;
    setAddExpenseLoading(true);
    try {
        const amount = parseFloat(newExpenseAmount);
        const members = group.members || []; 
        const splitAmount = amount / (members.length || 1);
        const splits = members.map((member: any) => ({
            userId: member._id || member.id || member,
            amount: splitAmount
        }));

        await ExpenseService.create({
            productName: newExpenseName,
            price: amount,
            category: "General",
            groupId: id,
            splits: splits
        });

        setNewExpenseName("");
        setNewExpenseAmount("");
        setIsAddExpenseOpen(false);
        fetchData();
    } catch (err) {
        alert("Failed to add expense.");
    } finally {
        setAddExpenseLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if(!id || !window.confirm("Remove this member from the group?")) return;
    try {
        await GroupService.removeMember(id, memberId);
        fetchData();
    } catch (err) {
        alert("Failed to remove member.");
    }
  };

  const handleAddNewMember = async (newUserId: string) => {
    if(!id) return;
    try {
        await GroupService.addMember(id, newUserId);
        setIsAddMemberMode(false);
        setMemberSearchQuery("");
        fetchData();
    } catch (err) {
        alert("Failed to add member.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  
  if (error || !group) {
      return (
          <div className="p-8 text-center flex flex-col items-center justify-center h-[60vh]">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Group Not Found</h2>
              <p className="text-red-500 mb-6 max-w-md">{error || "We couldn't load the group details."}</p>
              <button onClick={() => navigate("/groups")} className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Groups
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up p-6">
      
      {/* Top Nav */}
      <button onClick={() => navigate("/groups")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Groups
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 text-sm">Created {new Date(group.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{group.members?.length || 0} Members</span>
                </div>
            </div>
            <div className="flex gap-3">
                 <button onClick={handleSettleUp} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                    <Receipt className="w-5 h-5" />
                    <span>Settle Up</span>
                 </button>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Group Spending</p>
                <h3 className="text-3xl font-bold">₹ {totalSpending.toLocaleString()}</h3>
            </div>
            <Receipt className="absolute bottom-4 right-4 w-16 h-16 text-white opacity-10" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Your balance</p>
                <h3 className={`text-2xl font-bold ${userBalance.status === 'gets' ? 'text-green-600' : userBalance.status === 'owes' ? 'text-red-600' : 'text-gray-900'}`}>
                    {userBalance.status === 'settled' ? 'Settled' : `${userBalance.status === 'gets' ? '+' : '-'} ₹ ${userBalance.amount.toLocaleString()}`}
                </h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-full"><TrendingUp className="w-6 h-6 text-gray-400" /></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => setIsMembersModalOpen(true)}>
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Group Members</p>
                <h3 className="text-2xl font-bold text-gray-900">{group.members?.length || 0}</h3>
                <div className="flex items-center gap-1 text-indigo-600 text-xs font-semibold mt-1">
                    View & Manage <ChevronRight className="w-3 h-3" />
                </div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
         <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab('expenses')} className={`flex-1 py-4 text-sm font-semibold text-center relative ${activeTab === 'expenses' ? 'text-indigo-600' : 'text-gray-500'}`}>
                Expenses {activeTab === 'expenses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('balances')} className={`flex-1 py-4 text-sm font-semibold text-center relative ${activeTab === 'balances' ? 'text-indigo-600' : 'text-gray-500'}`}>
                Balances {activeTab === 'balances' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
         </div>

         <div className="p-6">
            {activeTab === 'expenses' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                        <button onClick={() => setIsAddExpenseOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </div>
                    {expenses.length > 0 ? expenses.map(ex => (
                        <div key={ex._id || ex.id} className="flex justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🧾</div>
                                <div><h4 className="font-bold text-gray-900">{ex.productName}</h4><p className="text-xs text-gray-500">{new Date(ex.date || Date.now()).toLocaleDateString()}</p></div>
                             </div>
                             <p className="font-bold">₹{ex.price}</p>
                        </div>
                    )) : <p className="text-gray-500 text-center py-8">No transactions yet.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Settlement Plan</h3>
                    {balances.length > 0 ? balances.map(b => (
                        <div key={b.userId} className="flex justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex gap-3 items-center"><div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{b.name.charAt(0)}</div><span className="font-semibold">{b.name}</span></div>
                            <span className={`font-bold ${b.status === 'gets' ? 'text-green-600' : 'text-red-600'}`}>{b.status === 'gets' ? '+' : '-'} ₹{Math.abs(b.balance)}</span>
                        </div>
                    )) : <p className="text-gray-500 text-center py-8">All settled up!</p>}
                </div>
            )}
         </div>
      </div>

      {/* Member Management Modal */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        {isAddMemberMode && <button onClick={() => setIsAddMemberMode(false)} className="mr-1 hover:bg-gray-100 p-1 rounded-full"><ArrowLeft className="w-4 h-4" /></button>}
                        <h2 className="text-lg font-bold text-gray-900">{isAddMemberMode ? "Add New Member" : "Group Members"}</h2>
                    </div>
                    <button onClick={() => { setIsMembersModalOpen(false); setIsAddMemberMode(false); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    {!isAddMemberMode ? (
                        <>
                            <div className="space-y-3">
                                {group.members.map((member: any) => (
                                    <div key={member._id || member.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">{member.name.charAt(0).toUpperCase()}</div>
                                            <div><p className="text-sm font-semibold text-gray-900">{member.name}</p><p className="text-xs text-gray-500">{member.email}</p></div>
                                        </div>
                                        <button onClick={() => handleRemoveMember(member._id || member.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover/item:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setIsAddMemberMode(true)} className="w-full mt-6 py-3 border border-dashed border-indigo-300 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" /> Add New Member
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search..." autoFocus className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={memberSearchQuery} onChange={(e) => setMemberSearchQuery(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                {isSearchingMembers ? <div className="text-center py-4"><Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-500" /></div> : 
                                memberSearchResults.length > 0 ? memberSearchResults.map(user => (
                                    <div key={user._id || user.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{user.name.charAt(0)}</div>
                                            <div className="text-sm"><p className="font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                                        </div>
                                        <button onClick={() => handleAddNewMember(user._id || user.id!)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Add</button>
                                    </div>
                                )) : <p className="text-center text-gray-400 text-sm py-4">{memberSearchQuery.length > 1 ? "No users found" : "Type to search users"}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
                    <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <input type="text" placeholder="Description" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} required />
                    <input type="number" placeholder="Amount (₹)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} required />
                    <button type="submit" disabled={addExpenseLoading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 flex justify-center items-center gap-2">
                        {addExpenseLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Expense"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
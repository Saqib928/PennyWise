import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ArrowLeft, Receipt, Users, TrendingUp, Settings, Share2, Plus, Loader2, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { GroupService } from "../services/groups.service";
import { ExpenseService } from "../services/expenses.service"; 
import type { Expense } from "../types/expense.types";
import type { Group, SettlementBalance } from "../types/group.types";

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data State
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<SettlementBalance[]>([]);

  // Computed Stats
  const [totalSpending, setTotalSpending] = useState(0);
  const [userBalance, setUserBalance] = useState<{ amount: number; status: 'gets' | 'owes' | 'settled' }>({ amount: 0, status: 'settled' });

  // Add Expense State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [addExpenseLoading, setAddExpenseLoading] = useState(false);

  // Helper to refresh data
  const fetchData = async () => {
    if (!id) return;
    try {
        const [groupRes, expensesRes, settlementRes] = await Promise.all([
          GroupService.getOne(id),
          ExpenseService.getByGroup(id), 
          GroupService.getSettlement(id)
        ]);

        if (groupRes.data.success) {
          setGroup(groupRes.data.data as Group);
        }

        if (expensesRes.data.success) {
          const expenseList = expensesRes.data.data;
          setExpenses(expenseList);
          
          const total = expenseList.reduce((sum: number, ex: any) => {
            const amount = ex.price || ex.amount || 0;
            return sum + Number(amount);
          }, 0);
          setTotalSpending(total);
        }

        if (settlementRes.data.success) {
          const balanceList = settlementRes.data.data;
          setBalances(balanceList);

          if (user) {
            const myBalance = balanceList.find((b: SettlementBalance) => b.userId === user.id || b.userId === user.id);
            if (myBalance) {
                setUserBalance({
                    amount: Math.abs(myBalance.balance),
                    status: myBalance.status
                });
            }
          }
        }
    } catch (err: any) {
        console.error("Failed to load group details", err);
        setError("Could not load group details.");
    } finally {
        setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleSettleUp = async () => {
    if (!id || !window.confirm("Are you sure you want to settle all your dues in this group?")) return;
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
        
        // Default: Split equally among all members
        const splitAmount = amount / group.members.length;
        const splits = group.members.map((member: any) => ({
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

        // Reset & Refresh
        setNewExpenseName("");
        setNewExpenseAmount("");
        setIsAddExpenseOpen(false);
        fetchData();

    } catch (err) {
        console.error("Failed to add expense", err);
        alert("Failed to add expense.");
    } finally {
        setAddExpenseLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
      );
  }

  if (error || !group) {
      return (
          <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error || "Group not found"}</p>
              <button onClick={() => navigate("/groups")} className="text-indigo-600 hover:underline">
                  Back to Groups
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up p-6">
      
      {/* --- TOP NAV --- */}
      <button 
        onClick={() => navigate("/groups")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Groups
      </button>

      {/* --- BANNER HEADER --- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 text-sm">
                        Created {new Date(group.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{group.members?.length || 0} Members</span>
                </div>
            </div>

            <div className="flex gap-3">
                 <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                    <Settings className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={handleSettleUp}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
                 >
                    <Receipt className="w-5 h-5" />
                    <span>Settle Up</span>
                 </button>
            </div>
        </div>
      </div>

      {/* --- STATS ROW --- */}
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
                {userBalance.status === 'gets' && (
                    <>
                        <p className="text-gray-500 text-sm font-medium mb-1">You are owed</p>
                        <h3 className="text-2xl font-bold text-green-600">+ ₹ {userBalance.amount.toLocaleString()}</h3>
                        <p className="text-xs text-gray-400 mt-1">From group splits</p>
                    </>
                )}
                {userBalance.status === 'owes' && (
                    <>
                        <p className="text-gray-500 text-sm font-medium mb-1">You owe</p>
                        <h3 className="text-2xl font-bold text-red-600">- ₹ {userBalance.amount.toLocaleString()}</h3>
                        <p className="text-xs text-gray-400 mt-1">To group members</p>
                    </>
                )}
                {userBalance.status === 'settled' && (
                    <>
                         <p className="text-gray-500 text-sm font-medium mb-1">Your balance</p>
                         <h3 className="text-2xl font-bold text-gray-900">Settled</h3>
                         <p className="text-xs text-gray-400 mt-1">No dues pending</p>
                    </>
                )}
            </div>
            <div className={`p-3 rounded-full ${userBalance.status === 'gets' ? 'bg-green-50 text-green-600' : userBalance.status === 'owes' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                <TrendingUp className="w-6 h-6" />
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active Members</p>
                <h3 className="text-2xl font-bold text-gray-900">{group.members?.length || 0}</h3>
                <p className="text-xs text-gray-400 mt-1">In this group</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                <Users className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* --- TABS & CONTENT --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
         <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('expenses')}
                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors relative ${activeTab === 'expenses' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
                Expenses
                {activeTab === 'expenses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('balances')}
                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors relative ${activeTab === 'balances' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
                Balances
                {activeTab === 'balances' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
         </div>

         <div className="p-6">
            {activeTab === 'expenses' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                        <button 
                            onClick={() => setIsAddExpenseOpen(true)} 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </button>
                    </div>
                    
                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense.id || expense._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                                        {expense.category === 'Food' ? '🍔' : expense.category === 'Transport' ? '🚕' : '🧾'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{expense.productName}</h4>
                                        <p className="text-xs text-gray-500">
                                            {typeof expense.paidBy === 'object' && expense.paidBy !== null 
                                                ? (expense.paidBy as any).name 
                                                : "User"} paid • {new Date(expense.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{expense.price}</p>
                                 </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No expenses yet. Add one to get started!</p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Settlement Plan</h3>
                    {balances.length > 0 ? (
                        <div className="grid gap-3">
                            {balances.map((b) => (
                                <div key={b.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                            {b.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{b.name}</p>
                                            <p className="text-xs text-gray-500">{b.email}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${b.status === 'gets' ? 'text-green-600' : 'text-red-600'}`}>
                                        {b.status === 'gets' ? '+' : '-'} ₹{Math.abs(b.balance).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">All Settled Up!</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">
                                No pending balances in this group.
                            </p>
                        </div>
                    )}
                </div>
            )}
         </div>
      </div>

      {/* --- ADD EXPENSE MODAL --- */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
                    <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Description</label>
                        <input 
                            type="text"
                            placeholder="e.g., Dinner at Taj"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={newExpenseName}
                            onChange={(e) => setNewExpenseName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input 
                            type="number"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={newExpenseAmount}
                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                            required
                            min="1"
                        />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm">
                        Info: This will be split equally among all {group.members.length} members.
                    </div>

                    <button 
                        type="submit" 
                        disabled={addExpenseLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                    >
                        {addExpenseLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Expense"}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
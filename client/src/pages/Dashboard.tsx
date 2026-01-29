import { useContext, useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Mic, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { AuthContext } from "../context/AuthContext";
import { ExpenseCard } from "../components/finance/ExpenseCard";
import { VoiceExpenseModal } from "../components/VoiceExpenseModal";
import { DashboardService } from "../services/dashboard.service";
import { GroupService } from "../services/groups.service";
import { ExpenseService } from "../services/expenses.service";

import type { Expense } from "../types/expense.types";

const chartData = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 200 },
  { name: 'Fri', amount: 900 },
  { name: 'Sat', amount: 1200 },
  { name: 'Sun', amount: 800 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext); 
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState({ totalSpent: 0, youOwe: 0, youGet: 0, groups: 0 });
  const [dashLoading, setDashLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      // 1. Fetch Summary Stats
      const summaryResponse = await DashboardService.getSummary();
      if (summaryResponse.data.success && summaryResponse.data.data) {
        setBalances(summaryResponse.data.data);
      }

      // 2. Fetch Groups & Expenses
      const groupsResponse = await GroupService.getAll();
      const groupsList = (groupsResponse.data.groups || []) as any[];

      if (Array.isArray(groupsList) && groupsList.length > 0) {
        let allExpenses: Expense[] = [];
        // Limit to 3 most recent groups to keep dashboard fast
        const recentGroups = groupsList.slice(0, 3);
        
        for (const group of recentGroups) {
          try {
            const groupId = group._id;
            if (groupId) {
                const expensesRes = await ExpenseService.getByGroup(groupId);
                
                // Handle different response structures (array directly or { expenses: [] })
                const groupExpenses = Array.isArray(expensesRes.data.data) 
                  ? expensesRes.data.data 
                  : (expensesRes.data.data as any)?.expenses || [];

                if (Array.isArray(groupExpenses)) {
                  allExpenses = [...allExpenses, ...groupExpenses];
                }
            }
          } catch (err) {
            console.warn(`Could not load expenses for group ${group.name}`);
          }
        }

        // Sort by date (newest first)
        allExpenses.sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
        });

        // Show top 5 recent expenses
        setExpenses(allExpenses.slice(0, 5)); 
      }
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setDashLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDashLoading(false);
      return;
    }
    setDashLoading(true);
    fetchDashboardData();
  }, [user, authLoading]);

  // Loading State
  if (authLoading || (dashLoading && user)) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
           <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      );
  }

  // Not Logged In State
  if (!user) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
                <p className="text-gray-500 mt-2">Please log in to view your dashboard.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-gray-50/50 min-h-screen relative animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name} 👋</p>
        </div>
        
        {/* Manual Add Button */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium active:scale-95">
          <Plus size={18} />
          <span>Quick Add</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Spent */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><Wallet size={20} /></div>
                    <span className="text-sm font-medium text-gray-500">Total Spent</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(balances.totalSpent)}</h3>
            </div>
        </div>

        {/* Card 2: You Get */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><ArrowDownLeft size={20} /></div>
                    <span className="text-sm font-medium text-gray-500">You receive</span>
                </div>
                <h3 className="text-3xl font-bold text-emerald-600">{formatCurrency(balances.youGet)}</h3>
            </div>
        </div>

        {/* Card 3: You Owe */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl"><ArrowUpRight size={20} /></div>
                    <span className="text-sm font-medium text-gray-500">You owe</span>
                </div>
                <h3 className="text-3xl font-bold text-rose-600">{formatCurrency(balances.youOwe)}</h3>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Spending Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Spending Activity</h3>
            <select className="bg-gray-50 border border-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-gray-100">
                <option>This Week</option>
                <option>This Month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Voice Assistant Card */}
        <div className="lg:col-span-1 relative overflow-hidden rounded-3xl shadow-xl group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-900/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10 p-8 flex flex-col items-center text-center h-full justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white mb-6 border border-white/10">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        AI Powered
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Voice Assistant</h3>
                    <p className="text-indigo-100 text-sm">Tap to add expenses instantly using your voice.</p>
                </div>

                <div className="my-8 relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20 group-hover:opacity-40 duration-1000"></div>
                    <button 
                        onClick={() => setIsVoiceModalOpen(true)}
                        className="w-20 h-20 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative z-10 cursor-pointer"
                    >
                        <Mic className="w-8 h-8" />
                    </button>
                </div>

                <p className="text-xs text-indigo-200 bg-white/10 px-4 py-2 rounded-lg">Try saying "Dinner 500"</p>
            </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {expenses.length > 0 ? (
              expenses.map((ex) => <ExpenseCard key={ex._id || ex.id} expense={ex} />)
          ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No recent transactions found.</p>
                  <p className="text-gray-400 text-sm mt-1">Start adding expenses to see them here.</p>
              </div>
          )}
        </div>
      </div>

      {/* Voice Expense Modal Component */}
      <VoiceExpenseModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExpenseAdded={() => {
            fetchDashboardData();
            setIsVoiceModalOpen(false);
        }}
      />
    </div>
  );
}
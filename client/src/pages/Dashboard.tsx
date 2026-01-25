import { useContext, useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Mic, Plus } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import { AuthContext } from "../context/AuthContext";
import { ExpenseCard } from "../components/finance/ExpenseCard";
import { VoiceInput } from "../components/VoiceInput";
import { ExpenseConfirmationModal } from "../components/ExpenseConfirmationModal";
import { DashboardService } from "../services/dashboard.service";
import { GroupService } from "../services/groups.service";

import type { Expense, ParsedExpense } from "../types/expense.types";

// Mock Chart Data (You can replace this with real data later)
const chartData = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 200 },
  { name: 'Fri', amount: 900 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext); 
  
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState({ totalSpent: 0, youOwe: 0, youGet: 0, groups: 0 });
  const [dashLoading, setDashLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [pendingExpense, setPendingExpense] = useState<ParsedExpense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  // --- Main Data Fetching Effect ---
  useEffect(() => {
    // 1. Wait for Auth to finish checking
    if (authLoading) return;

    // 2. If no user found, stop loading (will show "Please log in")
    if (!user) {
      setDashLoading(false);
      return;
    }

    // 3. User exists, fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setDashLoading(true);
        
        // Fetch Summary Stats
        const summaryResponse = await DashboardService.getSummary();
        if (summaryResponse.data.success && summaryResponse.data.data) {
          setBalances(summaryResponse.data.data);
        }

        // Fetch Recent Expenses from Groups
        const groupsResponse = await GroupService.getAll();
        if (groupsResponse.data.success && Array.isArray(groupsResponse.data.data)) {
          const allExpenses: Expense[] = [];
          
          // Loop through groups to get expenses (Limit to first 3 groups to save requests)
          for (const group of groupsResponse.data.data.slice(0, 3)) {
            try {
              const groupId = group._id || group.id; // Handle both ID formats
              if(groupId) {
                  const expensesResponse = await GroupService.getOne(groupId);
                  if (expensesResponse.data.success && Array.isArray(expensesResponse.data.data)) {
                    allExpenses.push(...expensesResponse.data.data);
                  }
              }
            } catch (err) {
              console.warn(`Could not load expenses for group`);
            }
          }
          // Sort by date (newest first) and take top 5
          setExpenses(allExpenses.slice(0, 5)); 
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setDashLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  // --- Handlers ---
  const handleVoiceInput = async (text: string) => {
    console.log("Voice input received:", text);
    // Simulating AI parsing for now
    setTimeout(() => {
        const mockParsedResult: ParsedExpense = {
            productName: "Simulated " + text.split(' ').slice(0, 2).join(' '),
            amount: Math.floor(Math.random() * 1000) + 100,
        };
        setPendingExpense(mockParsedResult);
        setIsModalOpen(true);
    }, 1000);
  };

  const handleConfirmExpense = (parsedEx: ParsedExpense) => {
    const newExpense: Expense = {
      _id: Date.now().toString(),
      productName: parsedEx.productName,
      price: parsedEx.amount,
      date: new Date().toISOString().split('T')[0],
      category: parsedEx.category || 'General',
      splits: []
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setIsModalOpen(false);
    setPendingExpense(null);
  };

  // --- Render Loading States ---
  if (authLoading || (dashLoading && user)) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
           <div className="text-indigo-600 font-medium animate-pulse">Loading dashboard...</div>
        </div>
      );
  }

  if (!user) {
      return (
        <div className="p-10 text-center text-gray-500">
          <p>Please log in to view your dashboard.</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user.name} 👋</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          <Plus size={18} />
          <span className="font-medium">New Expense</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Wallet size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(balances.totalSpent)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">You Get</p>
              <h3 className="text-2xl font-bold text-green-700">{formatCurrency(balances.youGet)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">You Owe</p>
              <h3 className="text-2xl font-bold text-red-700">{formatCurrency(balances.youOwe)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & AI Voice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Spending Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4"><Mic className="text-indigo-300" /></div>
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-gray-400 text-sm mb-6">"Split 500 rupees for lunch with Rahul..."</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <VoiceInput onResult={handleVoiceInput} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {expenses.length > 0 ? (
              expenses.map((ex) => <ExpenseCard key={ex._id || ex.id} expense={ex} />)
          ) : (
              <p className="text-gray-500">No recent transactions.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <ExpenseConfirmationModal
        expense={pendingExpense}
        isOpen={isModalOpen}
        onConfirm={handleConfirmExpense}
        onCancel={() => { setIsModalOpen(false); setPendingExpense(null); }}
      />
    </div>
  );
}
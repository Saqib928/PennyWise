import { useContext, useEffect, useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Mic, Plus } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

import { AuthContext } from "../context/AuthContext";
import { ExpenseCard } from "../components/finance/ExpenseCard";
import { VoiceInput } from "../components/VoiceInput"; // Your component
import { ExpenseConfirmationModal } from "../components/ExpenseConfirmationModal";
import { AIService, type ParsedExpense } from "../services/ai.service";
import type { Expense } from "../types/expense.types";

const chartData = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 200 },
  { name: 'Fri', amount: 900 },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pendingExpense, setPendingExpense] = useState<ParsedExpense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... (Keep your existing handleVoiceInput and handleConfirmExpense logic here) ...
  const handleVoiceInput = async (text: string) => { /* logic */ };
  const handleConfirmExpense = (ex: ParsedExpense) => { /* logic */ };

  // ... (Keep balances calculation here) ...
  const balances = { totalBalance: 1200, toPay: 300, toReceive: 1500 }; // Mock for display

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm">Welcome back, {user?.firstName|| "User"} 👋</p>
            </div>
            
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                <Plus size={18} />
                <span className="font-medium">New Expense</span>
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Balance</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(balances.totalBalance)}</h3>
                    </div>
                </div>
            </div>
            {/* Add other stats cards similarly... */}
        </div>

        {/* Charts & Voice Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Spending Trend</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Voice Action Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
                <div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <Mic className="text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        "Split 500 rupees for lunch with Rahul..."
                    </p>
                </div>
                
                {/* Your VoiceInput component styled for dark background */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <VoiceInput onResult={handleVoiceInput} />
                </div>
            </div>
        </div>

        {/* Recent Expenses List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-4">
                {expenses.map((ex) => <ExpenseCard key={ex.id} expense={ex} />)}
            </div>
        </div>

        {/* Modal Logic */}
        <ExpenseConfirmationModal
            expense={pendingExpense}
            isOpen={isModalOpen}
            onConfirm={handleConfirmExpense}
            onCancel={() => { setIsModalOpen(false); setPendingExpense(null); }}
        />
    </div>
  );
}
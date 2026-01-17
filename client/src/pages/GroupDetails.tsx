import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Receipt, Users, TrendingUp, Settings, Share2, Plus } from "lucide-react";
import type { Expense } from "../types/expense.types";


export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');

  // Mock Data
  const expenses: Expense[] = [
    {
      id: "1", productName: "Dinner at Marriott", price: 4500, category: "Food", paidBy: "Saqib",
      groupId: id || "", date: "2024-02-10T19:30:00", splits: [],
    },
    {
      id: "2", productName: "Uber to Hotel", price: 850, category: "Transport", paidBy: "Aman",
      groupId: id || "", date: "2024-02-10T18:00:00", splits: [],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      
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
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Trip</span>
                    <span className="text-gray-400 text-sm">Created Oct 12, 2025</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Goa Trip 🌴</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">4 Members: You, Aman, Ali, Rahul</span>
                </div>
            </div>

            <div className="flex gap-3">
                 <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                    <Settings className="w-5 h-5" />
                 </button>
                 <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all">
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
                <h3 className="text-3xl font-bold">₹ 12,500</h3>
            </div>
            <Receipt className="absolute bottom-4 right-4 w-16 h-16 text-white opacity-10" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">You are owed</p>
                <h3 className="text-2xl font-bold text-green-600">+ ₹ 2,500</h3>
                <p className="text-xs text-gray-400 mt-1">From 2 splits</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
                <TrendingUp className="w-6 h-6" />
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">You owe</p>
                <h3 className="text-2xl font-bold text-gray-900">₹ 0</h3>
                <p className="text-xs text-gray-400 mt-1">All settled up!</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                <Receipt className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* --- TABS & CONTENT --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
         {/* Tabs Header */}
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

         {/* Tab Content */}
         <div className="p-6">
            {activeTab === 'expenses' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                        <button className="text-sm text-indigo-600 font-medium hover:underline">View all</button>
                    </div>
                    
                    {expenses.map(expense => (
                        <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                                    {expense.category === 'Food' ? '🍔' : '🚕'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{expense.productName}</h4>
                                    <p className="text-xs text-gray-500">{expense.paidBy} paid • {new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="font-bold text-gray-900">₹{expense.price}</p>
                                <p className="text-xs font-medium text-green-600">You lent ₹{(expense.price / 4).toFixed(0)}</p>
                             </div>
                        </div>
                    ))}
                    
                    {/* Floating Add Button for Mobile/Desktop quick access inside list */}
                    <button className="w-full py-3 mt-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Balances</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">
                        Calculations showing who owes whom. (This would be a visual list in a real app).
                    </p>
                </div>
            )}
         </div>
      </div>

    </div>
  );
}
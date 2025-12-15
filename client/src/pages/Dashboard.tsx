import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ExpenseCard } from "../components/finance/ExpenseCard";
import { VoiceInput } from "../components/VoiceInput";
import { ExpenseConfirmationModal } from "../components/ExpenseConfirmationModal";
import { AIService, type ParsedExpense } from "../services/ai.service";
import type { Expense } from "../types/expense.types";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pendingExpense, setPendingExpense] = useState<ParsedExpense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Logged in user:", user);
  }, [user]);

  const handleVoiceInput = async (transcript: string) => {
    try {
      const response = await AIService.parseVoiceCommand(transcript);
      const parsed = response.data.data;
      setPendingExpense(parsed);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to parse voice command.");
    }
  };

  const handleConfirmExpense = (expense: ParsedExpense) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      productName: expense.product,
      price: expense.amount,
      paidBy: expense.paid_by,
      category: expense.category,
      groupId: expense.group,
      date: new Date().toISOString(),
      splits: [],
    };

    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    setPendingExpense(null);
  };

  // -------------------------
  // 💰 CALCULATE BALANCES
  // -------------------------
  const balances = useMemo(() => {
    let totalToPay = 0;
    let totalToReceive = 0;

    expenses.forEach((ex) => {
      ex.splits.forEach((s) => {
        if (s.userId === user?.id) {
          if (!s.isPaid) totalToPay += s.amount;
        } else {
          if (!s.isPaid && ex.paidBy === user?.name) {
            totalToReceive += s.amount;
          }
        }
      });
    });

    return {
      totalBalance: totalToReceive - totalToPay,
      toPay: totalToPay,
      toReceive: totalToReceive,
    };
  }, [expenses, user]);

  const format = (amount: number) => Math.abs(amount).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">

        <h1 className="text-2xl font-semibold mb-6">
          Welcome back, {user?.name || "User"} 👋
        </h1>

        <VoiceInput onResult={handleVoiceInput} />

        {/* TOTAL BALANCE HEADER */}
        <div className="mt-6 p-4 rounded-xl bg-white shadow-md">
          <p className="text-gray-600 text-sm">Your Balance</p>

          <h2
            className={`text-3xl font-bold mt-1 ${
              balances.totalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹ {format(balances.totalBalance)}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {balances.totalBalance >= 0 ? "You are owed money" : "You owe money"}
          </p>
        </div>

        {/* PAY / RECEIVE SUMMARY */}
        <div className="flex gap-4 mt-4">

          {/* To Receive */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Amount to Receive</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">
              ₹ {format(balances.toReceive)}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Others owe you</p>
          </div>

          {/* To Pay */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              ₹ {format(balances.toPay)}
            </h3>
            <p className="text-xs text-gray-500 mt-1">You owe others</p>
          </div>

        </div>

        {/* EXPENSE LIST */}
        <h2 className="mt-8 mb-4 text-xl font-semibold">Recent Expenses</h2>

        <div className="space-y-3">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No expenses yet. Add one using voice!
            </p>
          )}
        </div>
      </div>

      <ExpenseConfirmationModal
        expense={pendingExpense}
        isOpen={isModalOpen}
        onConfirm={handleConfirmExpense}
        onCancel={() => {
          setIsModalOpen(false);
          setPendingExpense(null);
        }}
      />
    </div>
  );
}

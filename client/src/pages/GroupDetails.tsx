import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Expense } from "../types/expense.types";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenses] = useState<Expense[]>([
    {
      id: "1",
      productName: "Pizza",
      price: 500,
      category: "Food",
      paidBy: "Saqib",
      groupId: id || "",
      date: new Date().toISOString(),
      splits: [
        { userId: "1", amount: 250, isPaid: true },
        { userId: "2", amount: 250, isPaid: false },
      ],
    },
  ]);

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/groups")}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Groups
      </button>

      <h1 className="text-3xl font-bold">Goa Trip</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold">₹12,500</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-gray-600">You are owed</p>
          <p className="text-2xl font-bold">₹2,500</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-gray-600">You owe</p>
          <p className="text-2xl font-bold">₹0</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-6">Expenses</h2>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{expense.productName}</p>
                <p className="text-gray-600 text-sm">Paid by {expense.paidBy}</p>
              </div>
              <p className="font-bold">₹{expense.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

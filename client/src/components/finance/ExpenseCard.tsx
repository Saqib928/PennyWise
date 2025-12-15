import type { Expense } from "../../types/expense.types";

export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <div className="border p-4 rounded-xl">
      <div className="font-semibold">{expense.productName}</div>
      <div className="text-neutral-600">₹ {expense.price}</div>
      <div className="text-sm text-neutral-500">{expense.category}</div>
    </div>
  );
}

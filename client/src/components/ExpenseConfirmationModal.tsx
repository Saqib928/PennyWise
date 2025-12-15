import type { ParsedExpense } from "../services/ai.service";

interface ExpenseConfirmationModalProps {
  expense: ParsedExpense | null;
  isOpen: boolean;
  onConfirm: (expense: ParsedExpense) => void;
  onCancel: () => void;
}

export function ExpenseConfirmationModal({
  expense,
  isOpen,
  onConfirm,
  onCancel,
}: ExpenseConfirmationModalProps) {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        <h2 className="text-xl font-bold">Confirm Expense</h2>

        <div className="space-y-2 text-gray-700">
          <div>
            <p className="text-sm font-medium">Product</p>
            <p className="text-lg">{expense.product}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Amount</p>
            <p className="text-lg font-bold">₹{expense.amount}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Paid By</p>
            <p>{expense.paid_by}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Group</p>
            <p>{expense.group}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Category</p>
            <p>{expense.category}</p>
          </div>

          {expense.split_type && (
            <div>
              <p className="text-sm font-medium">Split Type</p>
              <p className="capitalize">{expense.split_type}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(expense)}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

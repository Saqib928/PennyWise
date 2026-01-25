import { StateCreator } from 'zustand';
import { Expense } from '../../types/models';

export interface ExpenseSlice {
  currentGroupExpenses: Expense[];
  isLoadingExpenses: boolean;
  // Actions
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpenseInList: (expense: Expense) => void;
}

export const createExpenseSlice: StateCreator<ExpenseSlice> = (set) => ({
  currentGroupExpenses: [],
  isLoadingExpenses: false,

  setExpenses: (expenses) => set({ currentGroupExpenses: expenses }),

  addExpense: (expense) =>
    set((state) => ({ 
      currentGroupExpenses: [expense, ...state.currentGroupExpenses] 
    })),

  updateExpenseInList: (updatedExpense) =>
    set((state) => ({
      currentGroupExpenses: state.currentGroupExpenses.map((exp) =>
        exp._id === updatedExpense._id ? updatedExpense : exp
      ),
    })),
});
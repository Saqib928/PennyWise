import { api } from "./api";
import type { Expense } from "../types/expense.types";

export interface SplitItem {
  userId: string;
  amount: number;
}

export interface CreateExpenseRequest {
  productName: string;
  price: number;
  category: string;
  groupId: string;
  splits: SplitItem[];
}

export interface ExpenseResponse {
  success: boolean;
  data?: any; 
  message?: string;
}

export const ExpenseService = {
  // Create an expense
  create: (data: CreateExpenseRequest) => 
    api.post<ExpenseResponse>("/expenses", data),

  // Get expenses for a specific group
  getByGroup: (groupId: string) => 
    api.get<ExpenseResponse>(`/expenses?groupId=${groupId}`),

  // Mark an expense as paid
  markPaid: (expenseId: string) =>
    api.patch<ExpenseResponse>(`/expenses/${expenseId}/mark-paid`),
};
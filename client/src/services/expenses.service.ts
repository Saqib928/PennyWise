import { api } from "./api";

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
  getByGroup: (groupId: string) => 
    api.get<ExpenseResponse>(`/expenses?groupId=${groupId}`),
  
  create: (data: CreateExpenseRequest) => 
    api.post<ExpenseResponse>("/expenses", data),

  markPaid: (expenseId: string) =>
    api.patch<ExpenseResponse>(`/expenses/${expenseId}/mark-paid`),
};

import type { User } from "./user.types";

export interface Split {
  user?: User;
  userId?: string;
  amount: number;
  isPaid: boolean;
}

export interface Expense {
  _id?: string;
  id?: string;
  productName: string;
  price?: number;
  amount?: number;
  category: string;
  paidBy?: User | { name: string };
  groupId?: string;
  date?: string;
  splits: Split[];
  isSettled?: boolean;
}

export interface ParsedExpense {
  productName: string;
  amount: number;
  category?: string;
  groupId?: string;
  paidBy?: string;
}

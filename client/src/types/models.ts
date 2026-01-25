// Basic data shapes based on API responses
export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
}

export interface Group {
  _id: string;
  name: string;
  members?: any[]; // Define stricter member type if needed based on user service
}

export interface Expense {
  _id: string;
  productName: string;
  price: number;
  category: string;
  paidBy: { name: string; id?: string };
  isSettled: boolean;
  // ... add splits if needed for UI
}

export interface DashboardSummary {
  totalSpent: number;
  youOwe: number;
  youGet: number;
  groups: number;
}
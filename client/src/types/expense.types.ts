export interface Split {
  userId: string;
  amount: number;
  isPaid: boolean;
}

export interface Expense {
  id: string;
  productName: string;
  price: number;
  category: string;
  paidBy: string;
  groupId: string;
  date: string;
  splits: Split[];
  isSettled?: boolean;
}

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Import Slices
import type { AuthSlice } from './slices/authSlice';
import { createAuthSlice } from './slices/authSlice';
import type { GroupSlice } from './slices/groupSlice';
import { createGroupSlice } from './slices/groupSlice';
import type { ExpenseSlice } from './slices/expenseSlice';
import { createExpenseSlice } from './slices/expenseSlice';

// Combine all slice types into one StoreState type
export type StoreState = AuthSlice & GroupSlice & ExpenseSlice;

// Create the store combining the slice creators
export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createGroupSlice(...a),
      ...createExpenseSlice(...a),
    }),
    { name: 'PennyWise-Store' } // Name shown in devtools
  )
);
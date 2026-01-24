import { z } from "zod";

/* ---------- AUTH ---------- */
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* ---------- GROUP ---------- */
export const createGroupSchema = z.object({
  name: z.string().min(2),
  memberIds: z.array(z.string()).optional(),
});

/* ---------- EXPENSE ---------- */
export const splitSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
});

export const createExpenseSchema = z.object({
  productName: z.string(),
  price: z.number().positive(),
  category: z.string(),
  paidBy: z.string(),
  groupId: z.string(),
  splits: z.array(splitSchema),
});

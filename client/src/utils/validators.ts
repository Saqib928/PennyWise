import { z } from "zod";

export const expenseSchema = z.object({
  productName: z.string(),
  price: z.number(),
  category: z.string(),
});

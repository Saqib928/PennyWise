import { Request, Response } from "express";
import { Expense } from "./expense.model";

export async function createExpense(req: Request, res: Response) {
  const { productName, price, category, paidBy, groupId, splits } = req.body;

  const expense = await Expense.create({
    productName,
    price,
    category,
    paidBy,
    group: groupId,
    splits,
  });

  res.status(201).json({ expense });
}

export async function getExpenses(req: Request, res: Response) {
  const { groupId } = req.query;
  const query = groupId ? { group: groupId } : {};
  const expenses = await Expense.find(query)
    .populate("paidBy", "name email country")
    .populate("group", "name")
    .populate("splits.user", "name email");
  res.json({ expenses });
}

export async function markAsPaid(req: Request, res: Response) {
  const { expenseId, userId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  const split = expense.splits.find((s: any) => s.user.toString() === userId);
  if (!split) return res.status(404).json({ message: "User not in split" });

  split.isPaid = true;
  await expense.save();

  res.json({ message: "Payment marked as paid", expense });
}

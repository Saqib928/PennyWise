import { Request, Response } from "express";
import { Expense } from "./expense.model";
import { verifyGroupAccess } from "../../utils/groupAccess";

export async function createExpense(req: Request, res: Response) {
  const { productName, price, category, groupId, splits } = req.body;
  const userId = req.user!.id;

  const group = await verifyGroupAccess(groupId, userId);
  if (!group) {
    return res.status(403).json({ message: "Group access denied" });
  }

  if (!Array.isArray(splits) || splits.length === 0) {
    return res.status(400).json({ message: "Splits are required" });
  }

  const userIds = splits.map((s: any) => s.userId);
  if (new Set(userIds).size !== userIds.length) {
    return res.status(400).json({ message: "Duplicate users in splits" });
  }

  if (splits.some((s: any) => s.amount <= 0)) {
    return res.status(400).json({ message: "Invalid split amount" });
  }

  const totalSplit = splits.reduce(
    (sum: number, s: any) => sum + Number(s.amount),
    0
  );

  if (totalSplit !== price) {
    return res
      .status(400)
      .json({ message: "Split amounts must equal total price" });
  }

  const mappedSplits = splits.map((s: any) => ({
    user: s.userId,
    amount: s.amount,
    isPaid: false,
  }));

  const expense = await Expense.create({
    productName,
    price,
    category,
    paidBy: userId,
    group: groupId,
    splits: mappedSplits,
  });

  res.status(201).json({ success: true, data: expense });
}

export async function getExpenses(req: Request, res: Response) {
  const { groupId } = req.query;
  const userId = req.user!.id;

  if (groupId) {
    const group = await verifyGroupAccess(groupId as string, userId);
    if (!group) {
      return res.status(403).json({ message: "Group access denied" });
    }
  }

  const query: any = {};
  if (groupId) query.group = groupId;

  const expenses = await Expense.find(query)
    .populate("paidBy", "name email country")
    .populate("group", "name")
    .populate("splits.user", "name email");

  res.json({ success: true, data: expenses });
}

export async function markAsPaid(req: Request, res: Response) {
  const { expenseId } = req.params;
  const userId = req.user!.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const split = expense.splits.find(
    (s: any) => s.user.toString() === userId
  );

  if (!split) {
    return res.status(403).json({ message: "Not allowed" });
  }

  split.isPaid = true;
  await expense.save();

  res.json({ success: true, data: expense });
}

import { Request, Response } from "express";
import { Expense } from "./expense.model";
import { verifyGroupAccess } from "../../utils/groupAccess";
import { Group } from "../groups/group.model";
import { notify } from "../../utils/notify";

export async function createExpense(req: Request, res: Response) {
  const userId = req.user!.id;
  const { productName, price, category, groupId, splits } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
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

  for (const s of mappedSplits) {
    if (s.user.toString() !== userId) {
      await notify(s.user.toString(), "EXPENSE_ADDED", {
        expenseId: expense._id,
        groupId,
        productName,
        amount: s.amount,
        paidBy: userId,
      });
    }
  }

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
  const userId = req.user!.id;
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const split = expense.splits.find(
    (s: any) => s.user.toString() === userId
  );
  if (!split) {
    return res.status(404).json({ message: "User not in split" });
  }

  if (split.isPaid) {
    return res.status(400).json({ message: "Already paid" });
  }

  split.isPaid = true;
  await expense.save();

  await notify(expense.paidBy.toString(), "PAYMENT_DONE", {
    expenseId: expense._id,
    paidBy: userId,
  });

  res.json({ success: true, data: expense });
}

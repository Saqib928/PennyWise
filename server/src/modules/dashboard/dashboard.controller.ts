import { Request, Response } from "express";
import { Expense } from "../expenses/expense.model";
import { Group } from "../groups/group.model";

export async function getDashboardSummary(req: Request, res: Response) {
  const userId = req.user!.id;

  const groups = await Group.countDocuments({ members: userId });
  const expenses = await Expense.find({
    $or: [{ paidBy: userId }, { "splits.user": userId }],
  });

  let totalSpent = 0;
  let youOwe = 0;
  let youGet = 0;

  for (const expense of expenses) {
    if (expense.paidBy.toString() === userId) {
      totalSpent += expense.price;
    }

    for (const split of expense.splits) {
      if (split.user.toString() === userId) {
        if (expense.paidBy.toString() !== userId) {
          youOwe += split.amount;
        }
      }
    }
  }

  for (const expense of expenses) {
    if (expense.paidBy.toString() === userId) {
      for (const split of expense.splits) {
        if (split.user.toString() !== userId && !split.isPaid) {
          youGet += split.amount;
        }
      }
    }
  }

  res.json({
    success: true,
    data: { totalSpent, youOwe, youGet, groups },
  });
}

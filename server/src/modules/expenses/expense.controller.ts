import { Request, Response } from "express";
import { Expense } from "./expense.model";
import { verifyGroupAccess } from "../../utils/groupAccess";
import { Group } from "../groups/group.model";
import { notify } from "../../utils/notify";

export async function createExpense(req: Request, res: Response) {
  const paidBy = req.user!.id;
  const { productName, price, category, groupId, participantIds } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const groupMembers = group.members.map((m: any) => m.toString());

  const participants = participantIds?.length
    ? participantIds
    : groupMembers;

  const invalid = participants.find(
    (id: string) => !groupMembers.includes(id)
  );
  if (invalid) {
    return res.status(400).json({ message: "Invalid participant" });
  }

  const amountPerUser = price / participants.length;

  const splits = participants.map((userId: string) => ({
    user: userId,
    amount: amountPerUser,
    isPaid: userId === paidBy,
  }));

  const expense = await Expense.create({
    productName,
    price,
    category,
    paidBy,
    group: groupId,
    splits,
  });

  for (const s of splits) {
    if (s.user !== paidBy) {
      await notify(s.user, "EXPENSE_ADDED", {
        expenseId: expense._id,
        groupId,
        productName,
        amount: s.amount,
        paidBy,
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

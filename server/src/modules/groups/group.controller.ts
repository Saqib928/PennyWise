import { Request, Response } from "express";
import { Group } from "./group.model";
import { Expense } from "../expenses/expense.model";
import mongoose from "mongoose";
import { verifyGroupAccess } from "../../utils/groupAccess";
import { User } from "../users/user.model";
import { notify } from "../../utils/notify";

export async function createGroup(req: Request, res: Response) {
  try {
    const { name, inviteUserIds = [] } = req.body;
    const userId = (req as any).user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name required" });
    }

    const creator = await User.findById(userId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const group = await Group.create({
      name: name.trim(),
      members: [userId],
      createdBy: userId,
    });

    const uniqueInvites = [
      ...new Set(
        inviteUserIds
          .map((id: string) => id.toString())
          .filter((id: string) => id !== userId.toString())
      ),
    ];

    if (uniqueInvites.length > 0) {
      const invitedUsers = await User.find({
        _id: { $in: uniqueInvites },
      }).select("_id name username avatarUrl");

      for (const invitedUser of invitedUsers) {
        await notify(invitedUser._id.toString(), "GROUP_INVITE", {
          groupId: group._id,
          groupName: group.name,

          invitedById: creator._id,
          invitedByName: creator.name,
          invitedByUsername: creator.username,
          invitedByAvatar: creator.avatarUrl || null,
        });
      }
    }

    res.status(201).json({
      success: true,
      group,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create group",
    });
  }
}

export async function getGroups(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const groups = await Group.find({ members: userId }).populate("members", "name email country");
  res.json({ groups });
}

export async function getGroupById(req: Request, res: Response) {
  const { id } = req.params;
  const group = await Group.findById(id).populate("members", "name email country");
  if (!group) return res.status(404).json({ message: "Group not found" });
  res.json({ group });
}



export async function settleGroup(req: Request, res: Response) {
  const groupId = req.params.id;
  const userId = req.user!.id;

  const group = await verifyGroupAccess(groupId, userId);
  if (!group) {
    return res.status(403).json({ message: "Group access denied" });
  }

  const expenses = await Expense.find({ group: groupId });

  for (const expense of expenses) {
    const split = expense.splits.find(
      (s: any) => s.user.toString() === userId
    );
    if (split) split.isPaid = true;
    await expense.save();
  }

  res.json({ success: true, message: "All dues settled" });
}


export async function getGroupSettlement(req: Request, res: Response) {
  const groupId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: "Invalid group id" });
  }

  const group = await Group.findById(groupId).populate(
    "members",
    "name email"
  );

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const expenses = await Expense.find({ group: groupId });

  const balances: Record<string, number> = {};

  for (const member of group.members as any[]) {
    balances[member._id.toString()] = 0;
  }

  for (const expense of expenses) {
    const paidById = expense.paidBy.toString();
    balances[paidById] += expense.price;

    for (const split of expense.splits) {
      const userId = split.user.toString();
      balances[userId] -= split.amount;
    }
  }

  const settlement = (group.members as any[]).map((member) => {
    const balance = balances[member._id.toString()];
    return {
      userId: member._id,
      name: member.name,
      email: member.email,
      balance,
      status:
        balance > 0 ? "gets" : balance < 0 ? "owes" : "settled",
    };
  });

  res.json({
    groupId,
    settlement,
  });
}


export async function deleteGroup(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only group creator can delete this group" });
    }

    await Group.findByIdAndDelete(id);
    await Expense.deleteMany({ group: id });

    res.json({
      success: true,
      message: "Group and associated expenses deleted successfully",
    });

  } catch {
    res.status(500).json({ message: "Failed to delete group" });
  }
} 



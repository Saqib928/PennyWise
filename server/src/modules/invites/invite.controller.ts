import { Request, Response } from "express";
import { GroupInvite } from "../groups/groupInvite.model";
import { Group } from "../groups/group.model";
import { notify } from "../../utils/notify";


export async function sendInvite(req: Request, res: Response) {
  const { groupId } = req.params;
  const { userId } = req.body;
  const invitedBy = req.user!.id;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const existing = await GroupInvite.findOne({
    group: groupId,
    invitedUser: userId,
    status: "pending",
  });

  if (existing) {
    return res.status(400).json({ message: "Invite already sent" });
  }

  const invite = await GroupInvite.create({
    group: groupId,
    invitedUser: userId,
    invitedBy,
  });

  await notify(userId, "GROUP_INVITE", {
    inviteId: invite._id,
    groupId,
    groupName: group.name,
    invitedBy,
  });

  res.json({ success: true, data: invite });
}


export async function getMyInvites(req: Request, res: Response) {
  const userId = req.user!.id;

  const invites = await GroupInvite.find({
    invitedUser: userId,
    status: "pending",
  }).populate("group", "name");

  res.json({ success: true, data: invites });
}

export async function acceptInvite(req: Request, res: Response) {
  const { inviteId } = req.params;
  const userId = req.user!.id;

  const invite = await GroupInvite.findById(inviteId);
  if (!invite || invite.status !== "pending") {
    return res.status(404).json({ message: "Invite not found" });
  }

  invite.status = "accepted";
  await invite.save();

  await Group.findByIdAndUpdate(invite.group, {
    $addToSet: { members: userId },
  });

  await notify(invite.invitedBy.toString(), "INVITE_ACCEPTED", {
    groupId: invite.group,
    acceptedBy: userId,
  });

  res.json({ success: true });
}


export async function rejectInvite(req: Request, res: Response) {
  const { inviteId } = req.params;

  const invite = await GroupInvite.findById(inviteId);
  if (!invite || invite.status !== "pending") {
    return res.status(404).json({ message: "Invite not found" });
  }

  invite.status = "rejected";
  await invite.save();

  res.json({ success: true });
}

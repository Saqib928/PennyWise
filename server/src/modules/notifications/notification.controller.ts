import { Request, Response } from "express";
import { Notification } from "./notification.model";
import { Group } from "../groups/group.model";
import { notify } from "../../utils/notify";


export async function acceptGroupInvite(req: any, res: any) {
  const { notificationId } = req.params;
  const userId = req.user.id;

  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json({ message: "Invite not found" });
  }

  if (notification.type !== "GROUP_INVITE") {
    return res.status(400).json({ message: "Invalid invite" });
  }

  if (notification.isRead) {
    return res.json({ success: true });
  }

  const { groupId, invitedById } = notification.data;

  await Group.findByIdAndUpdate(groupId, {
    $addToSet: { members: userId },
  });

  notification.isRead = true;
  await notification.save();

  await notify(invitedById, "INVITE_ACCEPTED", {
    groupId,
    acceptedById: userId,
  });

  res.json({ success: true });
}

export async function rejectGroupInvite(req: any, res: any) {
  const { notificationId } = req.params;
  const userId = req.user.id;

  await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true }
  );

  res.json({ success: true });
}



export async function getNotifications(req: Request, res: Response) {
  const userId = req.user!.id;

  const notifications = await Notification.find({
    user: userId,
    isRead: false
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: notifications });
}


export async function markAsRead(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { isRead: true }
  );

  res.json({ success: true });
}

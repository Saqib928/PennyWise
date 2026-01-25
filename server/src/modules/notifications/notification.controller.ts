import { Request, Response } from "express";
import { Notification } from "./notification.model";

export async function getNotifications(req: Request, res: Response) {
  const userId = req.user!.id;

  const notifications = await Notification.find({ user: userId })
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

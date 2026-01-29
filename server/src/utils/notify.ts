import { Notification } from "../modules/notifications/notification.model";

type NotificationType =
  | "GROUP_INVITE"
  | "INVITE_ACCEPTED"
  | "EXPENSE_ADDED"
  | "PAYMENT_DONE";

export async function notify(
  userId: string,
  type: NotificationType,
  data: Record<string, any>
) {
  if (!userId || !type) return null;

  return Notification.create({
    user: userId,
    type,
    data: data || {},
    isRead: false,
  });
}
export async function notifyMany(
  userIds: string[],
  type: NotificationType,
  data: Record<string, any>
) {
  if (!userIds?.length) return [];

  const docs = userIds.map(id => ({
    user: id,
    type,
    data,
    isRead: false
  }));

  return Notification.insertMany(docs);
}

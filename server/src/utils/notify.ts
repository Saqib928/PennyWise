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
  return Notification.create({
    user: userId,
    type,
    data,
  });
}

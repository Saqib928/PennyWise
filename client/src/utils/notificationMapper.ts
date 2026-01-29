export function mapBackendNotification(n: any) {
  let type: any = "expense";
  let title = "";
  let message = "";
  let sender = "System";
  let amount;

  switch (n.type) {
    case "GROUP_INVITE":
      type = "invite";
      title = "Group Invite";
      message = `invited you to '${n.data.groupName}'`;
      sender = n.data.invitedByName || "User";
      break;

    case "EXPENSE_ADDED":
      type = "expense";
      title = "New Expense";
      message = `added '${n.data.productName}'`;
      amount = n.data.amount;
      sender = n.data.paidByName || "Member";
      break;

    case "PAYMENT_DONE":
      type = "settle";
      title = "Payment Received";
      message = `paid you`;
      amount = n.data.amount;
      break;
  }

  return {
    id: n._id,
    type,
    title,
    message,
    sender,
    amount,
    time: new Date(n.createdAt).toLocaleTimeString(),
    avatarColor: "bg-indigo-500",
    isRead: n.isRead,
  };
}

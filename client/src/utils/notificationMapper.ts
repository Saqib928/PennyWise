export function mapBackendNotification(n: any) {
  let type: "invite" | "expense" | "settle" = "expense";
  let title = "";
  let message = "";
  let sender = "System";
  let amount;
  let avatarColor = "bg-indigo-500";

  switch (n.type) {

    case "GROUP_INVITE":
      type = "invite";
      sender = n.data.invitedByName || "User";
      title = "Group Invite";
      message = `invited you to ${n.data.groupName}`;
      break;

    case "INVITE_ACCEPTED":
      type = "settle";
      sender = n.data.acceptedByName || "User";
      title = "Invite Accepted";
      message = `accepted your invite to ${n.data.groupName}`;
      break;

    case "EXPENSE_ADDED":
      type = "expense";
      sender = n.data.paidByName || "User";
      title = "New Expense";
      message = `added ${n.data.productName} in ${n.data.groupName}`;
      amount = n.data.amount;
      break;

    case "PAYMENT_DONE":
      type = "settle";
      sender = n.data.paidByName || "User";
      title = "Payment Done";
      message = `paid ₹${n.data.amount}`;
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
    avatarColor,
    time: new Date(n.createdAt).toLocaleTimeString(),
    isRead: n.isRead,
  };
}

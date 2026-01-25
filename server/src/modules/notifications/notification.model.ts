import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "GROUP_INVITE",
        "INVITE_ACCEPTED",
        "EXPENSE_ADDED",
        "PAYMENT_DONE",
      ],
      required: true,
    },

    data: {
      type: Schema.Types.Mixed,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);

import { Schema, model } from "mongoose";

const groupInviteSchema = new Schema(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const GroupInvite = model("GroupInvite", groupInviteSchema);

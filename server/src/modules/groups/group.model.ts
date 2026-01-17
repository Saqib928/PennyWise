import { Schema, model, Types } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Group = model("Group", groupSchema);

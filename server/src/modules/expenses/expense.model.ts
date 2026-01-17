import { Schema, model, Types } from "mongoose";

const splitSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    isPaid: { type: Boolean, default: false },
  },
  { _id: false }
);

const expenseSchema = new Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    paidBy: { type: Types.ObjectId, ref: "User", required: true },
    group: { type: Types.ObjectId, ref: "Group", required: true },
    date: { type: Date, default: Date.now },
    splits: [splitSchema],
  },
  { timestamps: true }
);

expenseSchema.virtual("isSettled").get(function (this: any) {
  return this.splits.length > 0 && this.splits.every((s: any) => s.isPaid);
});

export const Expense = model("Expense", expenseSchema);

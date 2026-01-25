import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    passwordHash: String,
    provider: { type: String, enum: ["google", "password"], default: "password" },
    avatarUrl: String,
    country: { type: String, default: "India" },
    username: {
  type: String,
  unique: true,
  required: true,
  lowercase: true,
  trim: true,
  index: true,
}

  },
  { timestamps: true }
);

export const User = model("User", userSchema);

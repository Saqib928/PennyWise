import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: String,

    provider: {
      type: String,
      enum: ["google", "password"],
      default: "password",
    },

    avatarUrl: String,

    country: {
      type: String,
      default: "India",
    },

    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);

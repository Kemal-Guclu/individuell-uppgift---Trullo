import { Schema, model } from "mongoose";

const allowedRoles = ["user", "admin"] as const;
type Role = (typeof allowedRoles)[number];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Ogiltig e-postadress"],
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: allowedRoles, default: "user" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);
// userSchema.index({ email: 1 }, { unique: true });

export const User = model("User", userSchema);

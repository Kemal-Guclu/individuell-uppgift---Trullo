import { Schema, model, Types } from "mongoose";

const allowed = ["to-do", "in-progress", "blocked", "done"] as const;
type Status = (typeof allowed)[number];

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: allowed, default: "to-do" },
    assignedTo: { type: Types.ObjectId, ref: "User", default: null },
    finishedAt: { type: Date, default: null },
    finishedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const Task = model("Task", taskSchema);

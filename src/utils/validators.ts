import mongoose from "mongoose";

//E-post validering
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email);
}
// Status validering
export const allowedStatuses = [
  "to-do",
  "in-progress",
  "blocked",
  "done",
] as const;
export type Status = (typeof allowedStatuses)[number];
export function isValidStatus(status: string): boolean {
  return allowedStatuses.includes(status as Status);
}

// ObjektId validering
export function isValidObjectId(id: string): boolean {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

// Lösenords validering
export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}

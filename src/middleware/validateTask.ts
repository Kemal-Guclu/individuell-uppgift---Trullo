import type { Request, Response, NextFunction } from "express";
import { isValidStatus } from "../utils/validators.js";
import { isValidObjectId } from "mongoose";

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { title, status, assignedTo } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Titel är obligatoriskt." });
  }
  if (status && !isValidStatus(status)) {
    return res.status(400).json({ error: "Ogiltig status." });
  }

  if (assignedTo && !isValidObjectId(assignedTo)) {
    return res.status(400).json({ error: "Ogiltig tilldelad användare." });
  }

  next();
}

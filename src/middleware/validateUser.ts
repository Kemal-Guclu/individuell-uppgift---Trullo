import type { Request, Response, NextFunction } from "express";
import { isValidEmail, isValidPassword } from "../utils/validators.js";

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Namn är obligatoriskt." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Ogiltig e-post adress." });
  }
  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ error: "Lösenordet måste vara minst 8 tecken långt." });
  }

  next();
}

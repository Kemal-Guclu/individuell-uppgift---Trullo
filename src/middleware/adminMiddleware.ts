import type { Request, Response, NextFunction } from "express";
import type { RequestHandler } from "express";

interface AuthUser {
  _id: string;
  email: string;
  role: string;
  // lägg till fler fält om du vill
}
interface AuthRequest extends Request {
  user?: AuthUser;
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Åtkomst nekad" });
};

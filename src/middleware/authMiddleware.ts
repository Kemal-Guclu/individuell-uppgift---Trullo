import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

// Extend Express Request interface to include 'user'
import type { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "No token provided" });
  }
  const secret = ENV.JWT_SECRET;
  if (typeof secret !== "string" || !secret) {
    return res.status(500).json({
      error: "Server error",
      message: "JWT_SECRET saknas eller är fel typ!",
    });
  }

  try {
    // Typa decoded korrekt
    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    // lägg decoded user info i req.user
    req.user = decoded;
    next();
  } catch (error) {
    // Typa error som unknown och gör en typkontroll
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid token" });
    }
    // Annat fel (t.ex. serverfel)
    return res.status(500).json({
      error: "Server error",
      message: "Något gick fel vid token-verifiering",
    });
  }
};

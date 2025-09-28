import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Kontrollera att email, password finns
    if (!email || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email och lösenord krävs",
      });
    }

    // Hämta användaren från DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Felaktigt lösenord eller e-post",
      });
    }

    // Jämför lösenord
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        error: "Felaktigt lösenord eller e-post",
      });
    }

    // Skapa JWT-token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      ENV.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Returnera token och eventuellt användardata
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

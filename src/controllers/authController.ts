import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import crypto from "crypto";

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

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    // Skapa en unik token för återställning av lösenord
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 timme

    await user.save();

    // Skicka e-post med återställningslänk   (implementera detta) eller logga token för nu under utvecklingen.
    // await sendPasswordResetEmail(user.email, resetToken);
    console.log(
      `Återställningslänk: http://localhost:3000/reset-password?token=${resetToken}`
    );

    res.status(200).json({
      message:
        "Återställningslänk har skickats till din e-post eller loggad i konsolen.",
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;

    // Hämta användaren med den angivna token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Ogiltig eller utgången token" });
    }

    // Hasha det nya lösenordet
    user.passwordHash = await bcrypt.hash(newPassword, ENV.BCRYPT_COST);
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;

    await user.save();

    res.status(200).json({ message: "Lösenordet har återställts." });
  } catch (error) {
    next(error);
  }
};

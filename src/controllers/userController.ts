//import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { ENV } from "../config/env.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // 2. Kontrollera unik e-post
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "E-postadressen är redan registrerad.",
      });
    }

    // 3. Hasha lösenordet
    const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_COST);

    // 4. Skapa/spara användaren
    const user = new User({ name, email, passwordHash });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // 1. Validera ObjectId.
    // if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Bad Request", message: "Ogiltigt ID." });
    // }
    // 2. Hämta användaren utan lösenord
    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Användare hittades inte." });
    }
    // 3. Returnera användaren utan lösenord
    res.status(200).json(user);
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const uppdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { name, email, password } = req.body;
    const uppdate: { name?: string; email?: string; passwordHash?: string } =
      {};
    if (name) uppdate.name = name.trim();
    if (email) {
      // Kontrollera unik e-post
      const existing = await User.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(409).json({
          error: "E-postadressen är redan registrerad.",
        });
      }
      uppdate.email = email.toLowerCase();
    }

    // 2. Validera och förbered uppdateringar
    // if (name) {
    //   if (typeof name !== "string" || name.trim() === "") {
    //     return res.status(400).json({
    //       error: "Bad Request",
    //       message: "Namn måste vara en icke-tom sträng.",
    //     });
    //   }
    //   uppdate.name = name.trim();
    // }
    // if (email) {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (typeof email !== "string" || !emailRegex.test(email)) {
    //     return res.status(400).json({
    //       error: "Bad Request",
    //       message: "Ogiltig e-postadress.",
    //     });
    //   }

    // 4. Validera och förbered lösenordsuppdatering
    if (password) {
      const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_COST);
      uppdate.passwordHash = passwordHash;
    }

    // 5. Om inget att uppdatera
    if (Object.keys(uppdate).length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Inga uppgifter att uppdatera.",
      });
    }

    // 6. Uppdatera användaren
    const updatedUser = await User.findByIdAndUpdate(id, uppdate, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");
    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Användare hittades inte." });
    }
    // 7. Returnera uppdaterad användare (utan lösenord)
    res.json(updatedUser);
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // 2. Försök att ta bort användaren.
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Användare hittades inte." });
    }
    // 3. Bekräfta borttagning.
    res.status(204).send();
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

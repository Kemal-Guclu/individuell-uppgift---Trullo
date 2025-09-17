import { Router } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { ENV } from "../config/env.js";
import mongoose from "mongoose";

const router = Router();

router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Grundläggande validering
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Alla fält är obligatoriska." });
    }
    if (password.length < 8) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Lösenordet måste vara minst 8 tecken långt.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltig e-postadress." });
    }
    // 2. Kontrollera unik e-post
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Conflict",
        message: "E-postadressen är redan registrerad.",
      });
    }
    // 3. Hasha lösenordet
    const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_COST);

    // 4. Skapa/spara användaren
    const user = new User({ name, email, passwordHash });
    await user.save();

    // 5. Svara med skapad användare (utan lösenord)
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validera ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

    // 2. Hämta användaren utan lösenord.
    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Användare hittades inte." });
    }

    // 3. Returnera användarenanvändardata (utan lösenord)
    res.status(200).json(user);
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   createdAt: user.createdAt,
    // });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validera ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

    const { name, email, password } = req.body;
    const uppdate: Record<string, unknown> = {};

    // 2. Validera och lägg till namn
    if (name) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Namn måste vara en icke-tom sträng.",
        });
      }
      uppdate.name = name.trim();
    }

    // 3. Validera och lägg till e-post
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== "string" || !emailRegex.test(email)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Ogiltig e-postadress.",
        });
      }
      // Kontrollera unik e-post
      const existing = await User.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(409).json({
          error: "Conflict",
          message: "E-postadressen är redan registrerad.",
        });
      }
      uppdate.email = email.toLowerCase();
    }

    // 4. Validera och lägg till lösenord
    if (password) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Lösenordet måste vara minst 8 tecken långt.",
        });
      }
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
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validera ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

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
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
});

export default router;
// export { router as usersRouter };

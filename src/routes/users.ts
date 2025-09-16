import { Router } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { ENV } from "../config/env.js";

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

export default router;
// export { router as usersRouter };

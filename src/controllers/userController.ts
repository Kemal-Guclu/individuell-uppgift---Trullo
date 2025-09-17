import mongoose from "mongoose";
import { User } from "../models/User.js";

export const deleteUser = async (req, res) => {
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
};

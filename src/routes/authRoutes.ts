import { Router } from "express";
import { login } from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

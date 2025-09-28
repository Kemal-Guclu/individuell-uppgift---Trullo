import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  uppdateUser,
  updateUserRole,
} from "../controllers/userController.js";
import { validateUser } from "../middleware/validateUser.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = Router();

router.post("/users", validateUser, createUser);

router.get("/users/:id", authMiddleware, getUserById);

router.get("/users", authMiddleware, getAllUsers);

router.patch("/users/:id", authMiddleware, validateUser, uppdateUser);

router.patch("/users/:id/role", authMiddleware, requireAdmin, updateUserRole);

router.delete("/users/:id", authMiddleware, requireAdmin, deleteUser);

export default router;
// export { router as usersRouter };

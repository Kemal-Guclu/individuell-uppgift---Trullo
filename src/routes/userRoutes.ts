import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  uppdateUser,
} from "../controllers/userController.js";
import { validateUser } from "../middleware/validateUser.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/users", validateUser, createUser);

router.get("/users/:id", authMiddleware, getUserById);

router.get("/users", authMiddleware, getAllUsers);

router.patch("/users/:id", authMiddleware, validateUser, uppdateUser);

router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
// export { router as usersRouter };

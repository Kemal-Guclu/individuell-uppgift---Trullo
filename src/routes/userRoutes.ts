import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  uppdateUser,
} from "../controllers/userController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = Router();

router.post("/users", validateUser, createUser);

router.get("/users/:id", validateUser, getUserById);

router.get("/users", getAllUsers);

router.patch("/users/:id", validateUser, uppdateUser);

router.delete("/users/:id", validateUser, deleteUser);

export default router;
// export { router as usersRouter };

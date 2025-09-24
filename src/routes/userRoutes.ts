import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  uppdateUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/users", createUser);

router.get("/users/:id", getUserById);

router.get("/users", getAllUsers);

router.patch("/users/:id", uppdateUser);

router.delete("/users/:id", deleteUser);

export default router;
// export { router as usersRouter };

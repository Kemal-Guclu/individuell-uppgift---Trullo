import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/taskController.js";
import { validateTask } from "../middleware/validateTask.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/tasks", authMiddleware, validateTask, createTask);

router.get("/tasks/:id", validateTask, getTaskById);

router.get("/tasks", getAllTasks);

router.patch("/tasks/:id", authMiddleware, validateTask, updateTask);

router.delete("/tasks/:id", authMiddleware, validateTask, deleteTask);

export default router;

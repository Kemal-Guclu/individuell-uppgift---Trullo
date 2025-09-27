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
import { getTasksForUser } from "../controllers/taskController.js";

const router = Router();

router.post("/tasks", authMiddleware, validateTask, createTask);

router.get("/tasks/:id", authMiddleware, getTaskById);

router.get("/users/:userId/tasks", authMiddleware, getTasksForUser);

router.get("/tasks", authMiddleware, getAllTasks);

router.patch("/tasks/:id", authMiddleware, validateTask, updateTask);

router.delete("/tasks/:id", authMiddleware, deleteTask);

export default router;

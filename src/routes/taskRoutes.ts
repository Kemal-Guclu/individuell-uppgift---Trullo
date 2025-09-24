import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/taskController.js";
import { validateTask } from "../middleware/validateTask.js";

const router = Router();

router.post("/tasks", validateTask, createTask);

router.get("/tasks/:id", validateTask, getTaskById);

router.get("/tasks", getAllTasks);

router.patch("/tasks/:id", validateTask, updateTask);

router.delete("/tasks/:id", validateTask, deleteTask);

export default router;

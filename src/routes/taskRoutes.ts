import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.post("/tasks", createTask);

router.get("/tasks/:id", getTaskById);

router.get("/tasks", getAllTasks);

router.patch("/tasks/:id", updateTask);

router.delete("/tasks/:id", deleteTask);

export default router;

import mongoose from "mongoose";
import type { Request, Response } from "express";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const allowedStatus = ["to-do", "in-progress", "blocked", "done"] as const;

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    // 1. Validera obligatoriska fält
    if (!title) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Titel är obligatoriskt." });
    }
    // 2. Validera status
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Ogiltig status.",
      });
    }
    // 3. Validera assignedTo (om angivet)
    let assignedUser = null;
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Ogiltigt användar-ID.",
        });
      }
      assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          error: "Not Found",
          message: "Användare hittades inte.",
        });
      }
    }
    // 4. Skapa och spara task
    const task = new Task({
      title,
      description,
      status: status || "to-do",
      assignedTo: assignedUser ? assignedUser._id : null,
    });
    await task.save();

    // 5. Returnera skapad task
    res.status(201).json(task);
  } catch (error) {
    console.error("Fel vid skapande av task:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Ett fel inträffade vid skapande av task.",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validera ObjectId.
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

    // 2. Hämta task
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
    }
    // 3. Returnera task
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

    const { title, description, status, assignedTo } = req.body;
    const update: {
      title?: string;
      description?: string;
      status?: string;
      assignedTo?: string | null;
      finishedAt?: Date | null;
    } = {};

    // Validera och lägg till title
    if (title) {
      if (typeof title !== "string" || title.trim() === "") {
        return res
          .status(400)
          .json({ error: "Bad Request", message: "Titel kan inte vara tom." });
      }
      update.title = title.trim();
    }

    // Validera och lägg till description
    if (description) {
      if (typeof description !== "string") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Description måste vara en sträng.",
        });
      }
      update.description = description;
    }

    // Validera och lägg till status
    if (status) {
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ error: "Bad Request", message: "Ogiltig status." });
      }
      update.status = status;
      // Om status är "done", sätt finishedAt
      if (status === "done") {
        update.finishedAt = new Date();
      } else {
        update.finishedAt = null; // Nollställ finishedAt om status ändras från "done"
      }
    }
    // Validera och lägg till assignedTo
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        update.assignedTo = null; // Avassignera tasken
      } else {
        const user = await User.findById(assignedTo);
        if (!user) {
          return res
            .status(400)
            .json({ error: "Bad Request", message: "Ogiltigt användar-ID." });
        }
        update.assignedTo = assignedTo;
      }
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Inga uppgifter att uppdatera.",
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Ogiltigt ID." });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

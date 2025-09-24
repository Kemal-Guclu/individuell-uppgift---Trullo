//import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

//const allowedStatus = ["to-do", "in-progress", "blocked", "done"] as const;

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    // 3. Validera assignedTo (om angivet)
    let assignedUser = null;
    if (assignedTo) {
      assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        throw new Error("Användaren som tasken ska tilldelas finns inte.");
        // return res.status(404).json({
        //   error: "Not Found",
        //   message: "Användare hittades inte.",
        // });
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
    next(error);
    // console.error("Fel vid skapande av task:", error);
    // res.status(500).json({
    //   error: "Internal Server Error",
    //   message: "Ett fel inträffade vid skapande av task.",
    // });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // 2. Hämta task
    const task = await Task.findById(id);
    if (!task) {
      throw new Error("Task hittades inte.");
      // return res
      //   .status(404)
      //   .json({ error: "Not Found", message: "Task hittades inte." });
    }
    // 3. Returnera task
    res.status(200).json(task);
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const getAllTasks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    const update: {
      title?: string;
      description?: string;
      status?: string;
      assignedTo?: string | null;
      finishedAt?: Date | null;
    } = {};

    // lägg till title
    if (title) update.title = title;
    //  lägg till description
    if (description) update.description = description;

    // Validera och lägg till status
    if (status) {
      update.status = status;
      // Om status är "done", sätt finishedAt
      if (status === "done") {
        update.finishedAt = new Date();
      } else {
        update.finishedAt = null; // Nollställ finishedAt om status ändras från "done"
      }
    }
    // Validera och lägg till assignedTo
    if (assignedTo !== undefined) update.assignedTo = assignedTo;

    if (Object.keys(update).length === 0) {
      throw new Error("Inga uppgifter att uppdatera.");
      // return res.status(400).json({
      //   error: "Bad Request",
      //   message: "Inga uppgifter att uppdatera.",
      // });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      throw new Error("Task hittades inte.");
      // return res
      //   .status(404)
      //   .json({ error: "Not Found", message: "Task hittades inte." });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new Error("Task hittades inte.");
      // return res
      //   .status(404)
      //   .json({ error: "Not Found", message: "Task hittades inte." });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
    // console.error(error);
    // res
    //   .status(500)
    //   .json({ error: "Internal Server Error", message: "Något gick fel." });
  }
};

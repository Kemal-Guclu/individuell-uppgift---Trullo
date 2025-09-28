//import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
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
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
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
    // Bygg filter baserat på query-parametrar
    const filter: Record<string, unknown> = {};
    if (_req.query.status) {
      filter.status = _req.query.status;
    }
    if (_req.query.assignedTo) {
      filter.assignedTo = _req.query.assignedTo;
    }

    // Bygg query
    let query = Task.find(filter);

    // Lägg till sortering om angivet
    if (_req.query.sort) {
      query = query.sort(_req.query.sort as string);
    }

    // Hämta tasks
    const tasks = await query.exec();

    // Returnera resultat
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
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
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

export const getTasksForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assignedTo: userId }).populate(
      "assignedTo",
      "name email"
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const markTaskAsDone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user as { _id: string; userId?: string | JwtPayload };
    //Hämta userId från JWT (satt i authMiddleware)
    const userId = user.userId || user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Ogiltig token." });
    }
    // Hämta och uppdatera tasken
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      {
        status: "done", // Endast om status är "done"
        finishedAt: new Date(),
        finishedBy: userId,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("finishedBy", "name email");

    if (!updatedTask) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Task hittades inte." });
    }
    res.status(200).json({
      message: "Task markerad som klar.",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

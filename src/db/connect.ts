import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
  if (!ENV.MONGODB_URI) throw new Error("MONGODB_URI is not defined");

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  mongoose.connection.on("error", (err: unknown) => {
    console.error("MongoDB connection error: ", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  await mongoose.connect(ENV.MONGODB_URI);
};

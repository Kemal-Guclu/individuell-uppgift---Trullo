import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Task } from "./models/Task.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import { finished } from "stream";

async function seed() {
  await connectDB();

  // Rensa befintliga data
  await User.deleteMany({});
  await Task.deleteMany({});

  // Skapa users
  const password1 = await bcrypt.hash("passw0rd!", ENV.BCRYPT_COST);
  const password2 = await bcrypt.hash("Secret123", ENV.BCRYPT_COST);

  const user1 = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    passwordHash: password1,
    role: "admin",
  });

  const user2 = await User.create({
    name: "Test User",
    email: "test@example.com",
    passwordHash: password2,
    role: "user",
  });
  // Skapa tasks
  await Task.create([
    {
      title: "Första Task",
      description: "Detta är en testuppgift.",
      status: "to-do",
      assignedTo: user1._id,
    },
    {
      title: "Andra Task",
      description: "Detta är en till testuppgift.",
      status: "in-progress",
      assignedTo: user2._id,
    },
    {
      title: "Oassignerad Task",
      description: "Ingen assignedTo.",
      status: "blocked",
      assignedTo: null,
    },
    {
      title: "Avslutad Task",
      description: "Denna uppgift är klar.",
      status: "done",
      assignedTo: user1._id,
      finishedAt: new Date(),
      finishedBy: user1._id,
    },
  ]);
  console.log("Databasen har seedats med testdata.");
  await mongoose.disconnect();
}
seed().catch((error) => {
  console.error("Misslyckades med att seed:a:", error);
  process.exit(1);
});

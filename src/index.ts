// Startar DB, skapar Express-app, registrerar middleware och routes och lyssnar på port

import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import healthRouter from "./routes/health.js";
import userRouter from "./routes/userRoutes.js";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(userRouter);

  // Registrera routes
  app.use(healthRouter);
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found", message: "Route not found" });
  });
  return app;
}

async function bootstrap() {
  await connectDB();
  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on http://localhost:${ENV.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

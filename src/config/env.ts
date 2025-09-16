// Laddar miljövariabler från en .env-fil om den finns och exporterar dem som en konfigurationsobjekt.

import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  BCRYPT_COST: process.env.BCRYPT_COST ? Number(process.env.BCRYPT_COST) : 12,
};

if (!ENV.MONGODB_URI) {
  console.warn("[VARNING] MONGODB_URI saknas i miljövariabler!");
}

import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../index";
import { User } from "../models/User";

const app = createApp();

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API integration", () => {
  it("ska skapa användare med giltiga data", async () => {
    const res = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "hemligt123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  it("ska returnera 400 om e-post är ogiltig", async () => {
    const res = await request(app).post("/users").send({
      name: "Test User",
      email: "ogiltig-email",
      password: "hemligt123",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/e-post/i);
  });

  it("ska returnera 400 om lösenordet är för kort", async () => {
    const res = await request(app).post("/users").send({
      name: "Test User",
      email: "kort@example.com",
      password: "123",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/lösenordet.*8/i);
  });

  it("ska returnera 409 om e-post redan finns", async () => {
    // Skapa användare först
    await request(app).post("/users").send({
      name: "Test User",
      email: "unik@example.com",
      password: "hemligt123",
    });
    const res = await request(app).post("/users").send({
      name: "Test User 2",
      email: "unik@example.com",
      password: "hemligt123",
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/e-post/i);
  });

  it("ska kunna logga in med rätt uppgifter", async () => {
    await request(app).post("/users").send({
      name: "Login User",
      email: "login@example.com",
      password: "hemligt123",
    });
    const res = await request(app).post("/login").send({
      email: "login@example.com",
      password: "hemligt123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("ska returnera 401 vid felaktigt lösenord", async () => {
    await request(app).post("/users").send({
      name: "WrongPass User",
      email: "wrongpass@example.com",
      password: "hemligt123",
    });
    const res = await request(app).post("/login").send({
      email: "wrongpass@example.com",
      password: "fel123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/felaktigt/i);
  });
});

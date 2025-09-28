import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../index";
import { Task } from "../models/Task";
import { User } from "../models/User";

const app = createApp();

let token: string;
let userId: string;

beforeAll(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  // Skapa en användare och logga in för att få JWT
  await request(app).post("/users").send({
    name: "TaskUser",
    email: "taskuser@example.com",
    password: "hemligt123",
  });
  const res = await request(app).post("/login").send({
    email: "taskuser@example.com",
    password: "hemligt123",
  });
  token = res.body.token;
  userId = res.body.user.id;
});

beforeEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task API integration", () => {
  it("ska skapa task med giltiga data", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", description: "desc" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("ska inte skapa task utan titel", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "desc" });
    expect(res.status).toBe(400);
  });

  it("ska hämta enskild task", async () => {
    const task = await Task.create({ title: "Get", description: "desc" });
    const res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Get");
  });

  it("ska ge 404 om task inte finns", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("ska hämta alla tasks", async () => {
    await Task.create({ title: "A", description: "desc" });
    await Task.create({ title: "B", description: "desc" });
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it("ska uppdatera task", async () => {
    const task = await Task.create({ title: "Old", description: "desc" });
    const res = await request(app)
      .patch(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New");
  });

  it("ska ta bort task", async () => {
    const task = await Task.create({ title: "Del", description: "desc" });
    const res = await request(app)
      .delete(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

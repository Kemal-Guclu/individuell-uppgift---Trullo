import { Task } from "../models/Task.js";

describe("Task model", () => {
  it("ska kräva title", () => {
    const task = new Task();
    const error = task.validateSync();
    expect(error?.errors.title).toBeDefined();
  });

  // Lägg till fler tester för Task-modellen
  // t.ex. kontrollera att status bara kan vara en av de tillåtna värdena
  it("ska bara tillåta giltiga statusvärden", () => {
    const task = new Task({ title: "Test Task", status: "done" });
    const error = task.validateSync();
    expect(error?.errors.status).toBeUndefined();
  });

  it("ska inte tillåta ogiltiga statusvärden", () => {
    const task = new Task({ title: "Test Task", status: "invalid-status" });
    const error = task.validateSync();
    expect(error?.errors.status).toBeDefined();
  });
});

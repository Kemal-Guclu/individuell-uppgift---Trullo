import { User } from "../models/User";

describe("User model", () => {
  it("ska kräva namn", () => {
    const user = new User({
      email: "test@example.com",
      password: "hemligt123",
    });
    const error = user.validateSync();
    expect(error?.errors.name).toBeDefined();
  });

  it("ska kräva giltig e-post", () => {
    const user = new User({
      name: "Test",
      email: "ogiltig",
      password: "hemligt123",
    });
    const error = user.validateSync();
    expect(error?.errors.email).toBeDefined();
  });

  // it("ska kräva lösenord med minst 8 tecken", () => {
  //   const user = new User({
  //     name: "Test",
  //     email: "test@example.com",
  //     password: "123",
  //   });
  //   const error = user.validateSync();
  //   expect(error?.errors.password).toBeDefined();
  // });
});

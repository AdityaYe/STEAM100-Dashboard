import request from "supertest";
import app from "../app";

describe("Auth Routes", () => {
  it("registers a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Aditya",
        email: "test@mail.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token)
      .toBeDefined();

    expect(res.body.user.email)
      .toBe("test@mail.com");
  });

  it("logs in user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "Aditya",
        email: "login@mail.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@mail.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token)
      .toBeDefined();
  });

  it("blocks invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@mail.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });
});
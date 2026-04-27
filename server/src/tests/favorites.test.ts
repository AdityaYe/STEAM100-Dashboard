import request from "supertest";
import app from "../app";

let token = "";

beforeEach(async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      username: "User",
      email: "fav@mail.com",
      password: "123456"
    });

  token = res.body.token;
});

describe("Favorite Routes", () => {
  it("adds favorite", async () => {
    const res = await request(app)
      .post("/api/favorites")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        appId: 730
      });

    expect(res.statusCode).toBe(200);
  });

  it("gets favorites", async () => {
    await request(app)
      .post("/api/favorites")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        appId: 730
      });

    const res = await request(app)
      .get("/api/favorites")
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    expect(res.body).toContain(730);
  });
});
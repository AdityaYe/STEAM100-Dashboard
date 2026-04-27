import request from "supertest";
import app from "../app";

let token = "";

beforeEach(async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      username: "User",
      email: "rate@mail.com",
      password: "123456"
    });

  token = res.body.token;
});

describe("Rating Routes", () => {
  it("creates rating", async () => {
    const res = await request(app)
      .post("/api/ratings")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        appId: 730,
        rating: 5,
        recommended: true
      });

    expect(res.statusCode).toBe(200);
  });

  it("gets game ratings", async () => {
    await request(app)
      .post("/api/ratings")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        appId: 730,
        rating: 5,
        recommended: true
      });

    const res = await request(app)
      .get("/api/ratings/730");

    expect(res.statusCode).toBe(200);
    expect(res.body.avgRating)
      .toBe(5);
  });
});
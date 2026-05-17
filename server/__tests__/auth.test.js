const request = require("supertest");
const app = require("../index");

describe("Auth API", () => {
  it("should return 400 when registration data is incomplete", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Name, email and password are required");
  });
});

const request = require("supertest");
const express = require("express");
const users = require("../src/users");
const app = require("../src/index");

describe("GET /user/:id", () => {
  it("should return user details for a valid ID", async () => {
    const user = users[0]; // Get the first user
    const response = await request(app).get(`/user/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  it("should return 404 for an invalid ID", async () => {
    const response = await request(app).get("/user/invalid-id");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should save user information to a file", async () => {
    const user = users[0]; // Get the first user
    const response = await request(app).get(`/user/${user.id}`);

    const fs = require("fs");
    const filePath = "./tests/user_info.json";

    fs.writeFileSync(filePath, JSON.stringify(response.body, null, 2));

    // Check if file was created
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

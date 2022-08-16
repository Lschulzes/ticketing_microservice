import jwt, { sign } from "jsonwebtoken";
import request from "supertest";
import app from "../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toBe(404);
});

it("can not be accessed if the user is not signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).toBe(401);
});

it("can be accessed if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns a error if an invalid title is provided", async () => {
  const response = await request(app).post("/api/tickets").send({ title: 1 });

  expect(response.status).toBe(401);
  expect(response.body.errors).toHaveLength(1);
});

it("return an error if an invalid price is provided", async () => {
  //
});

it("creates a ticket with valid inputs", async () => {
  //
});

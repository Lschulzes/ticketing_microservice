import jwt, { sign } from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import Ticket from "../models/Ticket";

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

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ price: 10 })
    .expect(400);
});

it("return an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "This is a valid title", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "This is a valid title" })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const title = "This is a valid title";
  const amountOfRecords = await Ticket.count();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price: 20 })
    .expect(201);

  const currentRecords = await Ticket.count();

  expect(currentRecords).toEqual(amountOfRecords + 1);
});

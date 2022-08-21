import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import { natsWrapper } from "../nats-wrapper";

const id = new mongoose.Types.ObjectId().toHexString();

it("has a route handler listening to /api/tickets for put requests", async () => {
  const response = await request(app).put(`/api/tickets/${id}`).send({});

  expect(response.status).not.toBe(404);
});

it("can not be accessed if the user is not signed in", async () => {
  const response = await request(app).put(`/api/tickets/${id}`).send({});

  expect(response.status).toBe(401);
});

it("can be accessed if the user is signed in", async () => {
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ price: 10 })
    .expect(400);
});

it("return an error if an invalid price is provided", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "This is a valid title", price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "This is a valid title" })
    .expect(400);
});

it("updates a ticket with valid inputs", async () => {
  const title = "This is a valid title";
  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(ticket.price).toEqual(20);

  // const { body: updatedTicket } = await request(app)
  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin())
    .send({ title, price: 10 })
    .expect(200);

  const { body: updatedTicket } = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .expect(200);

  expect(updatedTicket.price).toEqual(10);
  expect(updatedTicket.id).toEqual(ticket.id);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const title = "This is a valid title";
  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(ticket.price).toEqual(20);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin("another-id"))
    .send({ title, price: 10 })
    .expect(401);
});

it("published an event", async () => {
  const title = "This is a valid title";
  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(ticket.price).toEqual(20);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin())
    .send({ title, price: 10 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

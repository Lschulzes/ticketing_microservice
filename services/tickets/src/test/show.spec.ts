import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

const title = "This is a valid title";
const price = 20;

it("has a route handler listening to /api/tickets for get requests", async () => {
  await request(app).get("/api/tickets").expect(200);
});

it("Returns all tickets created when no id is passed", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

  const response = await request(app).get("/api/tickets").expect(200);

  expect(response.body).toHaveLength(2);
});

it("Returns only the Ticket with the ID passed In", async () => {
  await createTicket();
  await createTicket();
  const { body: ticket } = await createTicket();
  await createTicket();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .expect(200);

  expect(response.body.id).toEqual(ticket.id);
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});

it("Returns 404 if no ticket is found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).expect(404);
});

const createTicket = async () =>
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

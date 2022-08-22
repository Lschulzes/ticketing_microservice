import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import Ticket from "../../models/Ticket";
import { API_ENDPOINT } from "../../resources";

const { price, title } = { price: 10, title: "This is a valid title!" };

it("should return an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("should reserve a ticket", async () => {
  const ticket = await Ticket.build({ price, title }).save();

  await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("should return an error if the ticket is already reserved", async () => {
  const ticket = await Ticket.build({ price, title }).save();

  const sucessfulOrder = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  const failingOrder = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  expect(sucessfulOrder.statusCode).toEqual(201);
  expect(failingOrder.statusCode).toEqual(400);
});

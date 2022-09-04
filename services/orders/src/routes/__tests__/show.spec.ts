import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import Ticket from "../../models/Ticket";
import { API_ENDPOINT } from "../../resources";

const { price, title } = {
  price: 10,
  title: "This is a valid title!",
};

const createTicket = async () =>
  await Ticket.build({
    price,
    title,
    id: new mongoose.Types.ObjectId().toHexString(),
  }).save();

it("fetches orders for a particular user", async () => {
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  const user1 = global.signin();
  const user2 = global.signin("anotherId");

  await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order3 } = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const response = await request(app)
    .get(API_ENDPOINT)
    .set("Cookie", user2)
    .expect(200);

  expect(response.body.length).toEqual(2);

  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);

  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});

it("fetches the order", async () => {
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`${API_ENDPOINT}/${order.id}`)
    .set("Cookie", global.signin())
    .expect(200);

  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

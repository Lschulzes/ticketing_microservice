import { OrderStatus } from "common";
import request from "supertest";
import app from "../../app";
import Order from "../../models/Order";
import Ticket from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";
import { API_ENDPOINT } from "../../resources";

const { price, title } = { price: 10, title: "This is a valid title!" };

const createTicket = async () => await Ticket.build({ price, title }).save();

it("Changes an order to cancelled", async () => {
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.ticket.id).toEqual(ticket.id);
  expect(order.status).toEqual(OrderStatus.Created);

  await request(app)
    .delete(`${API_ENDPOINT}/${order.id}`)
    .set("Cookie", global.signin())
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order created event", async () => {
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post(API_ENDPOINT)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.ticket.id).toEqual(ticket.id);
  expect(order.status).toEqual(OrderStatus.Created);

  await request(app)
    .delete(`${API_ENDPOINT}/${order.id}`)
    .set("Cookie", global.signin())
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

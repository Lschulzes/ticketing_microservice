import { OrderCreatedEvent, OrderStatus } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const [price, title] = [10, "This is a valid title"];

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await Ticket.build({ title, price, userId: "sdsd" }).save();

  const eventData: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toString(),
    userId: "sdsd",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, eventData, ticket };
};

it("sets the user id of the ticket", async () => {
  const { eventData, listener, msg, ticket } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(eventData.id);
});

it("acknowledges the message", async () => {
  const { msg, eventData, listener } = await setup();

  await listener.onMessage(eventData, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("published a ticket updated event", async () => {
  const { listener, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(ticketUpdatedData.orderId);
});

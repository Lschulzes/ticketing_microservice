import { OrderCancelledEvent } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const [price, title, orderId] = [
  10,
  "This is a valid title",
  new mongoose.Types.ObjectId().toHexString(),
];

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await Ticket.build({ title, price, userId: "sdsd" })
    .set({ orderId, version: 1 })
    .save();

  const eventData: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "sdsd",
    version: 1,
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

it("removes the order id of the ticket", async () => {
  const { eventData, listener, msg, ticket } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
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

  expect(eventData.ticket.id).toEqual(ticketUpdatedData.id);
  expect(ticketUpdatedData.orderId).not.toBeDefined();
});

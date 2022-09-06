import { TicketUpdatedEvent } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const { id, price, title } = {
  id: new mongoose.Types.ObjectId().toHexString(),
  price: 99,
  title: "This is a valid title!",
};

const [newPrice, newTitle] = [999, "This is a new title!"];

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = await Ticket.build({ id, price, title }).save();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: newPrice,
    title: newTitle,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acknowledges the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not acknowledges the message if the version is not correct", async () => {
  const { data, listener, msg } = await setup();
  data.version = data.version + 15;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).toHaveBeenCalledTimes(0);
});

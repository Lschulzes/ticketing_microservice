import { OrderCreatedEvent, OrderStatus } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "./../../../models/Order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "ddfd",
    userId: "sfddsfdfs",
    status: OrderStatus.Created,
    ticket: {
      id: "dfdsf",
      price: 10,
    },
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const orderInTheDB = await Order.findById(data.id);

  expect(orderInTheDB!.id).toEqual(data.id);
  expect(orderInTheDB!.price).toEqual(data.ticket.price);
  expect(orderInTheDB!.userId).toEqual(data.userId);
});

it("acknowledges the messages", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

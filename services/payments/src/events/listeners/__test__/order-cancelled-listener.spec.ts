import { OrderCancelledEvent, OrderStatus } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const { id, price, status, userId, version } = {
  id: new mongoose.Types.ObjectId().toHexString(),
  version: 0,
  userId: "sfddsfdfs",
  status: OrderStatus.Created,
  price: 10,
};

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Order.build({
    id,
    price,
    status,
    userId,
    version,
  }).save();

  const data: OrderCancelledEvent["data"] = {
    id,
    version: 1,
    userId,
    status: OrderStatus.Cancelled,
    ticket: {
      id: "dfdsf",
      price: 10,
    },
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, order };
};

it("cancels the order", async () => {
  const { data, listener, msg, order } = await setup();

  const orderInTheDBBefore = await Order.findById(data.id);
  expect(orderInTheDBBefore!.status).not.toEqual(OrderStatus.Cancelled);

  await listener.onMessage(data, msg);

  const orderInTheDB = await Order.findById(data.id);

  expect(orderInTheDB!.id).toEqual(order.id);
  expect(orderInTheDB!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowledges the messages", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

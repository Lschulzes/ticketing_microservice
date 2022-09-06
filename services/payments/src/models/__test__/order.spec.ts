import { OrderStatus } from "common";
import mongoose from "mongoose";
import Order from "../Order";

const { id, price, status, userId, version } = {
  id: new mongoose.Types.ObjectId().toHexString(),
  version: 0,
  userId: "sfddsfdfs",
  status: OrderStatus.Created,
  price: 10,
};

it("Implements optimistic concurrency control", async () => {
  const order = await Order.build({
    id,
    price,
    status,
    userId,
    version,
  }).save();
  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error("Should not reach this point!");
});

it("increments the version number on multiple saves", async () => {
  const order = await Order.build({
    id,
    price,
    status,
    userId,
    version,
  }).save();
  expect(order.version).toEqual(0);
  await order.save();
  expect(order.version).toEqual(1);
  await order.save();
  expect(order.version).toEqual(2);
});

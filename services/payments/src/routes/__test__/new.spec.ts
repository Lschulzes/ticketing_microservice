import { OrderStatus } from "common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import Order from "../../models/Order";
import { API_ENDPOINT } from "../../resources/helper";

const { id, price, status, userId, version } = {
  id: new mongoose.Types.ObjectId().toHexString(),
  version: 0,
  userId: new mongoose.Types.ObjectId().toHexString(),
  status: OrderStatus.Created,
  price: 10,
};

const createOrder = async () =>
  await Order.build({ id, price, status, userId, version }).save();

it("Returns all tickets created when no id is passed", async () => {
  const order = await createOrder();

  const response = await request(app)
    .post(`${API_ENDPOINT}`)
    .set("Cookie", signin(userId))
    .send({ token: "fddsf", orderId: order.id })
    .expect(201);

  expect(response.body.success).toEqual(true);
});

it("Returns a 404 when purchasing a order that doesnt exist", async () => {
  await request(app)
    .post(`${API_ENDPOINT}`)
    .set("Cookie", signin(userId))
    .send({
      token: "fddsf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Returns a 403 when purchasing a order that does not belong to the user", async () => {
  const order = await createOrder();

  await request(app)
    .post(`${API_ENDPOINT}`)
    .set("Cookie", signin("another_user_id"))
    .send({ token: "fddsf", orderId: order.id })
    .expect(403);
});

it("Returns a 400 when purchasing a cancelled order", async () => {
  const order = await createOrder();

  await order.set({ status: OrderStatus.Cancelled }).save();

  await request(app)
    .post(`${API_ENDPOINT}`)
    .set("Cookie", signin(userId))
    .send({ token: "fddsf", orderId: order.id })
    .expect(400);
});

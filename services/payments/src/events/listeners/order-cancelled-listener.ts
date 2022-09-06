import { AppError, Listener, OrderCancelledEvent, Subjects } from "common";
import { Message } from "node-nats-streaming";
import Order from "../../models/Order";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { id, status, version } = data;
    const order = await Order.findOne({ id, version: version - 1 });
    if (!order) throw new AppError("Order not found!", 404);

    await order.set({ status }).save();

    msg.ack();
  }
}

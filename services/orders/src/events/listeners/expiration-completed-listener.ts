import {
  AppError,
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "common";
import { Message } from "node-nats-streaming";
import Order from "../../models/Order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage({ orderId }: { orderId: string }, msg: Message) {
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) throw new AppError("Order not found!", 404);
    if (order.status === OrderStatus.Complete) return msg.ack();

    await order.set({ status: OrderStatus.Cancelled }).save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      userId: order.userId,
      version: order.version,
      status: OrderStatus.Cancelled,
    });

    msg.ack();
  }
}

import {
  AppError,
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "common";
import { Message } from "node-nats-streaming";
import Order from "../../models/Order";
import { OrderCompletedPublisher } from "../publishers/order-completed-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName: string = QUEUE_GROUP_NAME;
  readonly subject = Subjects.PaymentCreated;

  async onMessage({ orderId }: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found!", 404);

    const updatedOrder = await order
      .set({ status: OrderStatus.Completed })
      .save();

    const { id, ticket, userId, version } = updatedOrder;

    await new OrderCompletedPublisher(this.client).publish({
      id,
      status: OrderStatus.Completed,
      ticket: { id: ticket.id, price: ticket.price },
      userId,
      version,
    });
  }
}

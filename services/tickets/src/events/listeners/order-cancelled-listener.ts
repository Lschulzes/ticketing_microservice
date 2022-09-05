import { AppError, Listener, OrderCancelledEvent, Subjects } from "common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName = QUEUE_GROUP_NAME;
  readonly subject = Subjects.OrderCancelled;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new AppError("Ticket not found!", 404);

    await ticket.set({ orderId: void 0 }).save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}

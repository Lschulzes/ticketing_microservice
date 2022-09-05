import { AppError, Listener, OrderCreatedEvent, Subjects } from "common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName = QUEUE_GROUP_NAME;
  readonly subject = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new AppError("Ticket not found!", 404);
    if (ticket.orderId) throw new AppError("Ticket already reserved", 422);

    await ticket.set({ orderId: data.id }).save();

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

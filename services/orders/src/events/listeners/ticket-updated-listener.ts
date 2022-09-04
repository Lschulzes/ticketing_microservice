import { AppError, Listener, Subjects, TicketUpdatedEvent } from "common";
import { Message } from "node-nats-streaming";
import { Ticket } from "./../../models/Ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName: string = QUEUE_GROUP_NAME;
  readonly subject = Subjects.TicketUpdated;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) throw new AppError("Ticket not found!", 404);

    const { title, price } = ticket;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

import { AppError, Listener, Subjects, TicketUpdatedEvent } from "common";
import { Message } from "node-nats-streaming";
import { Ticket } from "./../../models/Ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName: string = QUEUE_GROUP_NAME;
  readonly subject = Subjects.TicketUpdated;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, price, version, title } = data;

    const ticket = await Ticket.findByEvent({
      id: id,
      version: version,
    });

    if (!ticket) throw new AppError("Ticket not found!", 404);

    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}

import { Listener, Subjects, TicketCreatedEvent } from "common";
import { Message } from "node-nats-streaming";
import { Ticket } from "./../../models/Ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName: string = QUEUE_GROUP_NAME;
  readonly subject = Subjects.TicketCreated;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();

    msg.ack();
  }
}

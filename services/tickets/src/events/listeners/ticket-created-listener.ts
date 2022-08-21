import { Listener, Subjects, TicketCreatedEvent } from "common";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = "any";
  readonly subject = Subjects.TicketCreated;

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log({ data });

    msg.ack();
  }
}

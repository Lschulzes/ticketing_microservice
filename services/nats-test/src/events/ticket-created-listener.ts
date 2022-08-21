import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  constructor(client: Stan) {
    super(client);
  }

  onMessage<T>(data: T, msg: Message) {
    console.log({ data });

    msg.ack();
  }
}

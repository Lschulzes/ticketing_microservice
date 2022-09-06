import { Listener, OrderCreatedEvent, Subjects } from "common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { QUEUE_GROUP_NAME } from "../queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage({ id }: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({ orderId: id });
    msg.ack();
  }
}

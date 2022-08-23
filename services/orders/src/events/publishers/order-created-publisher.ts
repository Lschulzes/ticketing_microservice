import { OrderCreatedEvent, Publisher, Subjects } from "common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

import { OrderCancelledEvent, Publisher, Subjects } from "common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

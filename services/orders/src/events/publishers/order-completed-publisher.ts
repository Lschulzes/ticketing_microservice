import { OrderCompletedEvent, Publisher, Subjects } from "common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}

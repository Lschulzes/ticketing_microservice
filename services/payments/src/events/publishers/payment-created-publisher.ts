import { PaymentCreatedEvent, Publisher, Subjects } from "packages/common/src";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

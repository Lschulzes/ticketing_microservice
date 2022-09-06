import { ExpirationCompletedEvent, Publisher, Subjects } from "common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}

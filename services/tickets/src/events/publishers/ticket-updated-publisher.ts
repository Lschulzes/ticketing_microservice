import { Publisher, Subjects, TicketCreatedEvent } from "common";

export class TicketUpdatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

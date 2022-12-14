import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    version: number;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    version: number;
    price: number;
    userId: string;
    orderId?: string;
  };
}

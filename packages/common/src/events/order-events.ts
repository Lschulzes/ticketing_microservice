import { OrderStatus } from "./consts";
import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    version: number;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    userId: string;
    version: number;
    status: OrderStatus.Cancelled;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCompletedEvent {
  subject: Subjects.OrderCompleted;
  data: {
    id: string;
    userId: string;
    version: number;
    status: OrderStatus.Completed;
    ticket: {
      id: string;
      price: number;
    };
  };
}

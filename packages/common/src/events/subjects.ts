export enum Subjects {
  TicketCreated = `ticket:created`,
  TicketUpdated = `ticket:updated`,
  OrderUpdated = `order:updated`,
}

export enum OrderStatus {
  Created = "Created",
  Cancelled = "Cancelled",
  AwaitingPayment = "AwaitingPayment",
  Complete = "Complete",
}
type CRUDOps = "created" | "updated" | "deleted";

export enum Subjects {
  TicketCreated = `ticket:created`,
  OrderUpdated = `order:updated`,
}

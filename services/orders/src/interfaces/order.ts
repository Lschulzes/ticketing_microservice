import mongoose from "mongoose";

export interface OrderAttrs {
  userId: string;
  status: string;
  expiresAt: Date;
  ticketId: TicketDoc;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticketId: TicketDoc;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

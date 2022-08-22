import mongoose from "mongoose";

export interface TicketAttrs {
  title: string;
  price: Date;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: Date;
  isReserved(): Promise<boolean>;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

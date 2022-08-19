import mongoose from "mongoose";
import { TicketAttrs, TicketDoc, TicketModel } from "../interfaces/ticket";

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

TicketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  TicketSchema,
  "tickets"
);

export default Ticket;

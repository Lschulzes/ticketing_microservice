import { OrderStatus } from "common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketAttrs, TicketDoc, TicketModel } from "../interfaces/ticket";
import Order from "./Order";

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = ({ id, price, title }: TicketAttrs) =>
  new Ticket({ id, _id: id, title, price });

type Event = {
  id: string;
  version: number;
};

TicketSchema.statics.findByEvent = ({ id, version }: Event) =>
  Ticket.findOne({
    _id: id,
    version: version - 1,
  });

TicketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: { $ne: OrderStatus.Cancelled },
  });

  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  TicketSchema,
  "tickets"
);

export default Ticket;

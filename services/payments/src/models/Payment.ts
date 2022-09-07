import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { PaymentAttrs, PaymentDoc, PaymentModel } from "../interfaces/Payment";

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

PaymentSchema.set("versionKey", "version");
PaymentSchema.plugin(updateIfCurrentPlugin);

PaymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs);

export const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  PaymentSchema,
  "payments"
);

export default Payment;

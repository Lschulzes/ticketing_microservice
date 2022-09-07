import { AppError, authGuard, OrderStatus } from "common";
import { Request, Response, Router } from "express";
import { newChargeValidation } from "../dtos/new-dto";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import Order from "../models/Order";
import Payment from "../models/Payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/",
  authGuard,
  ...newChargeValidation,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found!", 404);
    if (order.userId !== req.currentUser?.id)
      throw new AppError("Not authorized!", 403);
    if (order.status === OrderStatus.Cancelled)
      throw new AppError("Cannot pay for a cancelled order!", 400);

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ id: payment.id });
  }
);

export { router as NewChargeRouter };

import {
  AppError,
  OrderStatus,
  validateMongooseIdInParamsMiddleware,
} from "common";
import { Request, Response, Router } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import Order from "../models/Order";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/:orderId",
  validateMongooseIdInParamsMiddleware("orderId"),
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== req.currentUser!.id)
      throw new AppError("Not authorized", 403);

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      status: OrderStatus.Cancelled,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(204).send({});
  }
);

export { router as DeleteOrderRouter };

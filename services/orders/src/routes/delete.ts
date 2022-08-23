import {
  AppError,
  OrderStatus,
  validateMongooseIdInParamsMiddleware,
} from "common";
import { Request, Response, Router } from "express";
import Order from "../models/Order";

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

    res.status(204).send({});
  }
);

export { router as DeleteOrderRouter };

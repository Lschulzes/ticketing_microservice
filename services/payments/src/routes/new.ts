import { AppError, authGuard, OrderStatus } from "common";
import { Request, Response, Router } from "express";
import { newChargeValidation } from "../dtos/new-dto";
import Order from "../models/Order";

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

    res.status(201).json({ success: true });
  }
);

export { router as NewChargeRouter };

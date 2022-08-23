import { authGuard, validateMongooseIdInParamsMiddleware } from "common";
import { Request, Response, Router } from "express";
import Order from "../models/Order";

const router = Router();

router.get(
  "/:orderId?",
  authGuard,
  validateMongooseIdInParamsMiddleware("orderId"),
  async (req: Request, res: Response) => {
    const { orderId = null } = req.params;

    const userId = req.currentUser!.id;

    const orders = await Order.find(
      orderId ? { userId, _id: orderId } : { userId }
    ).populate("ticket");

    res.status(200).send(orderId ? orders?.[0] : orders);
  }
);

export { router as ShowOrderRouter };

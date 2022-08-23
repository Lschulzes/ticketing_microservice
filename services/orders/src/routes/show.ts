import { authGuard } from "common";
import { Request, Response, Router } from "express";
import Order from "../models/Order";

const router = Router();

router.get("/:id?", authGuard, async (req: Request, res: Response) => {
  const { id = null } = req.params;
  const orders = await Order.find(
    id
      ? {
          userId: req.currentUser!.id,
          _id: id,
        }
      : { userId: req.currentUser!.id }
  ).populate("ticket");

  res.send(orders);
});

export { router as ShowOrderRouter };

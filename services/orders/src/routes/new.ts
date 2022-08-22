import { authGuard } from "common";
import { Request, Response, Router } from "express";
import { createOrderValidation } from "../dtos/create-order";

const router = Router();

router.post(
  "/",
  authGuard,
  ...createOrderValidation,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as CreateOrderRouter };

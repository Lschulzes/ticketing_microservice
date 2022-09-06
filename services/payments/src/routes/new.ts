import { authGuard } from "common";
import { Request, Response, Router } from "express";
import { newChargeValidation } from "../dtos/new-dto";

const router = Router();

router.post(
  "/",
  authGuard,
  ...newChargeValidation,
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as NewChargeRouter };

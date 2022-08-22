import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  res.send({});
});

export { router as CreateOrderRouter };

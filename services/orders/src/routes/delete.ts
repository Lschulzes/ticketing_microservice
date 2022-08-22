import { Request, Response, Router } from "express";

const router = Router();

router.delete("/:id", async (req: Request, res: Response) => {
  res.send({});
});

export { router as DeleteOrderRouter };

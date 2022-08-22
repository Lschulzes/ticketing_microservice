import { Request, Response, Router } from "express";

const router = Router();

router.get("/:id?", async (req: Request, res: Response) => {
  res.send({});
});

export { router as ShowOrderRouter };

import { Request, Response, Router } from "express";
import { authGuard } from "@lschulzes/tickets-common";
import { newTicketDTO } from "../dtos/new-dto";

const router = Router();

router.post("/", authGuard, newTicketDTO, (req: Request, res: Response) => {
  console.log(req.cookies);
  res.status(200).send({});
});

export { router as CreateTicketRouter };

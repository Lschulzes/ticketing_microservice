import { newTicketValidation } from "./../dtos/new-dto";
import { Request, Response, Router } from "express";
import {
  authGuard,
  validateRequestMiddleware,
} from "@lschulzes/tickets-common";
import Ticket from "../models/Ticket";

const router = Router();

router.post(
  "/",
  authGuard,
  ...newTicketValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser?.id || "",
    }).save();

    res.status(201).send(ticket);
  }
);

export { router as CreateTicketRouter };

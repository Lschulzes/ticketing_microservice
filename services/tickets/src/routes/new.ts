import { authGuard } from "common";
import { Request, Response, Router } from "express";

import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import Ticket from "../models/Ticket";
import { natsWrapper } from "../nats-wrapper";
import { newTicketValidation } from "./../dtos/new-dto";

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

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as CreateTicketRouter };

import { AppError, authGuard } from "common";
import { Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";
import { newTicketValidation } from "../dtos/new-dto";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import Ticket from "../models/Ticket";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/:id",
  authGuard,
  ...newTicketValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new AppError("Invalid id", 400);
    const ticket = await Ticket.findById(id);

    if (!ticket) throw new AppError("Ticket not found", 404);

    const sameUser = ticket.userId === req.currentUser?.id;
    if (!sameUser)
      throw new AppError("User must own a ticket to update it", 401);

    await ticket.set({ ...req.body }).save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as UpdateTicketRouter };

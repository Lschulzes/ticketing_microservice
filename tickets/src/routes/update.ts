import { Request, Response, Router } from "express";
import { AppError, authGuard } from "@lschulzes/tickets-common";
import Ticket from "../models/Ticket";
import mongoose, { isValidObjectId } from "mongoose";
import { newTicketValidation } from "../dtos/new-dto";

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

    res.status(200).send(ticket);
  }
);

export { router as UpdateTicketRouter };

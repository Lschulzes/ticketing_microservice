import { Request, Response, Router } from "express";
import { AppError } from "@lschulzes/tickets-common";
import Ticket from "../models/Ticket";
import mongoose from "mongoose";

const router = Router();

router.get("/:id?", async (req: Request, res: Response) => {
  const { id } = req.params;

  const isValidId = mongoose.isValidObjectId(id);
  if (id && !isValidId)
    throw new AppError(`Id of value "${id}" is not valid!`, 400);

  const tickets = await Ticket.find(isValidId ? { _id: id } : {});

  if (id && !tickets.length)
    throw new AppError(`No id of value "${id}" found!`, 404);

  res.status(200).send(isValidId ? tickets[0] : tickets);
});

export { router as ShowTicketRouter };

import { AppError, authGuard, OrderStatus } from "common";
import { Request, Response, Router } from "express";
import { createOrderValidation } from "../dtos/create-order";
import { Order } from "./../models/Order";
import { Ticket } from "./../models/Ticket";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/",
  authGuard,
  ...createOrderValidation,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new AppError("Ticket not found!", 404);

    if (await ticket.isReserved())
      throw new AppError("Ticket is already reserved", 400);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await Order.build({
      expiresAt,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket,
    }).save();

    res.status(201).send(order);
  }
);

export { router as CreateOrderRouter };

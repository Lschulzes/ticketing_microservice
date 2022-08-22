import { validateRequestMiddleware } from "common";
import { body } from "express-validator";

const CreateOrderDTO = [
  body("ticketId").not().isEmpty().withMessage("ticketId must be provided"),
];

export const createOrderValidation = [
  CreateOrderDTO,
  validateRequestMiddleware,
];

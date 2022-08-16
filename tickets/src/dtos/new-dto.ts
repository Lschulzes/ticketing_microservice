import { validateRequestMiddleware } from "@lschulzes/tickets-common";
import { body } from "express-validator";

export const newTicketDTO = [
  body("title")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Must be an descriptive Title.")
    .isLength({ min: 4, max: 40 })
    .withMessage("Title must be between 4 and 40 characters"),
];

export const signinValidation = [newTicketDTO, validateRequestMiddleware];

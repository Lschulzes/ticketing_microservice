import { validateRequestMiddleware } from "common";
import { body } from "express-validator";

const newChargeDTO = [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];

export const newChargeValidation = [newChargeDTO, validateRequestMiddleware];

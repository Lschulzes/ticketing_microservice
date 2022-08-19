import { validateRequestMiddleware } from "common";
import { body } from "express-validator";

export const signupInputDTO = [
  body("email").isEmail().withMessage("Must be an valid email."),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const signupValidation = [signupInputDTO, validateRequestMiddleware];

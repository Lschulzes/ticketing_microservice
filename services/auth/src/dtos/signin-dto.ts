import { validateRequestMiddleware } from "common";
import { body } from "express-validator";

export const signinInputDTO = [
  body("email").isEmail().withMessage("Must be an valid email."),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const signinValidation = [signinInputDTO, validateRequestMiddleware];

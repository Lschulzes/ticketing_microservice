import { ValidationError } from "express-validator";
import { AppError } from "./app-error";

export class RequestValidationError extends AppError {
  constructor(errors: Array<ValidationError>) {
    const message = errors.reduce(
      (acc, cur, i) =>
        acc +
        `${i !== 0 ? " | " : ""}Param ${cur.param} at ${cur.location}: ${
          cur.msg
        }`,
      ""
    );

    super(message, 400);
  }
}

import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { CustomError } from "../errors/custom-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!(err instanceof CustomError)) {
    res.status(500).send({
      errors: "Something went wrong!",
    });
  }

  res.status(err.statusCode).send({
    errors: err.serializeErrors(),
  });
};

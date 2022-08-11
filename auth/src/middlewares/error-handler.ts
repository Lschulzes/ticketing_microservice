import { AppError } from "./../resources/helpers";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(err.statusCode).send({
    message: err.message,
  });
};

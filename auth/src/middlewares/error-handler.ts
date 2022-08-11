import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

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

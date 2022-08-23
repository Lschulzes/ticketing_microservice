import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors";

export const validateMongooseIdInParamsMiddleware =
  (param: string) => (req: Request, _res: Response, next: NextFunction) => {
    const id = req.params[param];

    const isValidId = mongoose.isValidObjectId(id);
    if (id && !isValidId)
      throw new AppError(`Id of value "${id}" is not valid!`, 400);

    next();
  };

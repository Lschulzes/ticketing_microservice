import { AppError } from "./../errors/app-error";
import { NextFunction, Request, Response } from "express";

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) throw new AppError("User needs to be logged in", 401);

  next();
};

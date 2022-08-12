import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}

export const currentUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const sessionJWT = req.session?.jwt;

  try {
    if (!sessionJWT) throw new Error();
    console.log({ sessionJWT });
    const payload = jwt.verify(sessionJWT, process.env.JWT_KEY!) as UserPayload;

    req.currentUser = payload;
  } catch (error) {
    req.currentUser = null;
  }

  next();
};

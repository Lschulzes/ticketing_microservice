import { User } from "./../models/User";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { AppError } from "../errors/app-error";

const router = Router();

router.get(`/`, async (req, res) => {
  const sessionJWT = req.session?.jwt;
  if (!sessionJWT) return res.send({ currentUser: null });

  try {
    const payload = jwt.verify(sessionJWT, process.env.JWT_KEY!) as {
      id: string;
    };

    res.status(200).send({ currentUser: payload });
  } catch (error) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };

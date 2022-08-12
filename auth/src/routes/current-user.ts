import { User } from "./../models/User";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { AppError } from "../errors/app-error";
import { currentUser } from "../middlewares/current-user";

const router = Router();

router.get(`/`, currentUser, async (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };

import { Router } from "express";
import { currentUser } from "../middlewares/current-user";

const router = Router();

router.get(`/`, currentUser, async (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };

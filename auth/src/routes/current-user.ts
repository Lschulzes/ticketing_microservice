import { currentUser } from "@lschulzes/tickets-common";
import { Router } from "express";

const router = Router();

router.get(`/`, currentUser, async (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };

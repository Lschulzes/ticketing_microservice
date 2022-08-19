import { Router } from "express";

const router = Router();

router.post(`/`, (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };

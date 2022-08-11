import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { SignupInputDTO } from "../dtos/signup";
import { AppError } from "../resources/helpers";

const router = Router();

router.post(`/`, SignupInputDTO, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array().toString(), 400);

  const { email, password } = req.body;

  res.send({});
});

export { router as signupRouter };

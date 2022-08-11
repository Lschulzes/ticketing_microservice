import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { SignupInputDTO } from "../dtos/signup.dto";
import { RequestValidationError } from "../errors/request-validation-error";

const router = Router();

router.post(`/`, SignupInputDTO, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

  const { email, password } = req.body;

  res.send({});
});

export { router as signupRouter };

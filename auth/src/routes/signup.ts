import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { SignupInputDTO } from "../dtos/signup-dto";
import { AppError } from "../errors/app-error";
import { RequestValidationError } from "../errors/request-validation-error";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();

router.post(`/`, SignupInputDTO, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already exists", 400);

  const user = await User.build({ email, password }).save();

  const userJWT = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJWT };

  res.status(201).send(user);
});

export { router as signupRouter };

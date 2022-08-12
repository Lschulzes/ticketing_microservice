import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../errors/app-error";
import { RequestValidationError } from "../errors/request-validation-error";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { signupValidation } from "../dtos/signup-dto";

const router = Router();

router.post(`/`, ...signupValidation, async (req: Request, res: Response) => {
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

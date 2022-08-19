import { AppError } from "common";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { signinValidation } from "../dtos/signin-dto";
import User from "../models/User";
import { Password } from "../services/password";

const router = Router();

router.post(`/`, ...signinValidation, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new AppError("Invalid credentials", 400);

  const passwordsMatch = await Password.compare(
    password,
    existingUser.password
  );

  if (!passwordsMatch) throw new AppError("Invalid credentials", 400);

  const userJWT = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJWT };

  res.status(200).send(existingUser);
});

export { router as signinRouter };

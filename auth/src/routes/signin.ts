import cookieSession from "cookie-session";
import jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";
import { signinValidation } from "../dtos/signin-dto";
import { AppError } from "../errors/app-error";
import User from "../models/User";
import { Password } from "../services/password";

const router = Router();

router.post(`/`, ...signinValidation, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new AppError("Invalid credentials", 403);

  const passwordsMatch = await Password.compare(
    password,
    existingUser.password
  );

  if (!passwordsMatch) throw new AppError("Invalid credentials", 403);

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

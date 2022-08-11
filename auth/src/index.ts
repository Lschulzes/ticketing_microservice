import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import {
  CURRENT_USER_ENDPOINT,
  SIGNIN_ENDPOINT,
  SIGNOUT_ENDPOINT,
  SIGNUP_ENDPOINT,
} from "./resources/helpers";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { AppError } from "./errors/app-error";
const app = express();

app.use(json());

app.use(CURRENT_USER_ENDPOINT, currentUserRouter);
app.use(SIGNIN_ENDPOINT, signinRouter);
app.use(SIGNOUT_ENDPOINT, signoutRouter);
app.use(SIGNUP_ENDPOINT, signupRouter);

app.all("*", (req, _res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

import express from "express";
import "express-async-errors";
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
import cookieSession from "cookie-session";
import { AppError, errorHandler } from "@lschulzes/tickets-common";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(CURRENT_USER_ENDPOINT, currentUserRouter);
app.use(SIGNIN_ENDPOINT, signinRouter);
app.use(SIGNOUT_ENDPOINT, signoutRouter);
app.use(SIGNUP_ENDPOINT, signupRouter);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

export default app;

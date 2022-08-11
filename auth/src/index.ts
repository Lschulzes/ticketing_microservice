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
import { errorHandler } from "./middlewares/error-handler";
import { AppError } from "./errors/app-error";
import mongoose from "mongoose";

const app = express();

app.use(json());

app.use(CURRENT_USER_ENDPOINT, currentUserRouter);
app.use(SIGNIN_ENDPOINT, signinRouter);
app.use(SIGNOUT_ENDPOINT, signoutRouter);
app.use(SIGNUP_ENDPOINT, signupRouter);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to auth DB");
  } catch (error) {
    console.error("Mongo Connection", error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();

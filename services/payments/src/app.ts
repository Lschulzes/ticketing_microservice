import { json } from "body-parser";
import { AppError, currentUser, errorHandler } from "common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

export default app;

import { json } from "body-parser";
import { AppError, currentUser, errorHandler } from "common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { API_ENDPOINT, SHOW_ENDPOINT } from "./resources";
import { DeleteOrderRouter } from "./routes/delete";
import { CreateOrderRouter } from "./routes/new";
import { ShowOrderRouter } from "./routes/show";

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

app.use(API_ENDPOINT, CreateOrderRouter);
app.use(SHOW_ENDPOINT, ShowOrderRouter);
app.use(API_ENDPOINT, DeleteOrderRouter);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

export default app;

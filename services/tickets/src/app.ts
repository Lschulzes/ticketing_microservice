import { json } from "body-parser";
import { AppError, currentUser, errorHandler } from "common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { API_ENDPOINT, SHOW_ENDPOINT } from "./resources";
import { CreateTicketRouter } from "./routes/new";
import { ShowTicketRouter } from "./routes/show";
import { UpdateTicketRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
  })
);
app.use(currentUser);

app.use(API_ENDPOINT, CreateTicketRouter);
app.use(SHOW_ENDPOINT, ShowTicketRouter);
app.use(API_ENDPOINT, UpdateTicketRouter);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

export default app;

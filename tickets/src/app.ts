import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { AppError, currentUser, errorHandler } from "@lschulzes/tickets-common";
import { CreateTicketRouter } from "./routes/new";
import { API_ENDPOINT } from "./resources";

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

app.use(API_ENDPOINT, CreateTicketRouter);

app.all("*", async (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

export default app;

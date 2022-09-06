import mongoose from "mongoose";
import { Stan } from "node-nats-streaming";
import app from "./app";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

let stan: Stan;

const start = async () => {
  try {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
    if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
    if (!process.env.NATS_CLUSTER_ID)
      throw new Error("NATS_CLUSTER_ID must be defined");
    if (!process.env.NATS_CLIENT_ID)
      throw new Error("NATS_CLIENT_ID must be defined");

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to tickets DB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();

export { stan };

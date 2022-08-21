import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const clientID = process.env.CLIENT_ID || (Math.random() * 10000).toFixed();

console.clear();
const stan = nats.connect("ticketing", clientID, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("NATS Listener connected");

  new TicketCreatedListener(stan).listen();

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

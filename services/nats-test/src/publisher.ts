import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
const data = { id: "sdsdd", title: "Concert", price: 20 };

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("NATS Publisher connected");

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish(data);
});

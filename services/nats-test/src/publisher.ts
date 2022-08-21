import nats from "node-nats-streaming";
console.clear();
const data = JSON.stringify({ id: "sdsdd", title: "Concert", price: 20 });

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("NATS Publisher connected");

  stan.publish("ticket:created", data);
});

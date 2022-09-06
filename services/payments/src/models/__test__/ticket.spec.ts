import Ticket from "../Ticket";

const { title, price, userId } = {
  title: "This is a valid title!",
  price: 5,
  userId: "123",
};

it("Implements optimistic concurrency control", async () => {
  const ticket = await Ticket.build({ title, price, userId }).save();
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error("Should not reach this point!");
});

it("increments the version number on multiple saves", async () => {
  const ticket = await Ticket.build({ title, price, userId }).save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

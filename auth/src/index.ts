import express from "express";
import { json } from "body-parser";

const app = express();

app.use(json());

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).send(`User with id of ${id}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

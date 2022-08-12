import request from "supertest";
import app from "../../app";
import { SIGNUP_ENDPOINT } from "../../resources/helpers";

const email = "admin@admin.com";
const password = "123456";

it("Returns a 201 on successful signup", async () => {
  return request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(201);
});

it("Returns a 400 with an invalid email", async () => {
  return request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email: "adminadmin.com",
      password,
    })
    .expect(400);
});

it("Returns a 400 with an invalid password", async () => {
  return request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password: "1",
    })
    .expect(400);
});

it("Returns a 400 with missing email and password", async () => {
  await request(app).post(SIGNUP_ENDPOINT).send({ email }).expect(400);

  return request(app).post(SIGNUP_ENDPOINT).send({ password }).expect(400);
});

it("Disallows duplicate emails", async () => {
  await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({ email, password })
    .expect(201);

  return request(app)
    .post(SIGNUP_ENDPOINT)
    .send({ email, password })
    .expect(400);
});

it("sets a cookie after succesfull signup", async () => {
  const response = await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({ email, password })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

import request from "supertest";
import app from "../../app";
import { SIGNIN_ENDPOINT, SIGNUP_ENDPOINT } from "../../resources/helpers";

const email = "admin@admin.com";
const password = "123456";

it("Returns a 400 for unexisting user", async () => {
  return request(app)
    .post(SIGNIN_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(400);
});

it("Fails when incorrect password is supplied", async () => {
  await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(201);

  return request(app)
    .post(SIGNIN_ENDPOINT)
    .send({
      email,
      password: "WRONG PASSWORD",
    })
    .expect(400);
});

it("Responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(201);

  const response = await request(app)
    .post(SIGNIN_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

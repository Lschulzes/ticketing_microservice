import request from "supertest";
import app from "../../app";
import {
  SIGNIN_ENDPOINT,
  SIGNOUT_ENDPOINT,
  SIGNUP_ENDPOINT,
} from "../../resources/helpers";

const email = "admin@admin.com";
const password = "123456";

it("Clears the cookie after signing out", async () => {
  await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(201);

  const response = await request(app)
    .post(SIGNOUT_ENDPOINT)
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});

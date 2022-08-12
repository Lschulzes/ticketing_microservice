import request from "supertest";
import app from "../../app";
import {
  CURRENT_USER_ENDPOINT,
  SIGNUP_ENDPOINT,
} from "../../resources/helpers";

const email = "admin@admin.com";
const password = "123456";

it("responds with details about the current user", async () => {
  const signupResponse = await request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email,
      password,
    })
    .expect(201);

  const response = await request(app)
    .get(CURRENT_USER_ENDPOINT)
    .set("Cookie", signupResponse.get("Set-Cookie"))
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual(email);
});

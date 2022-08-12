import request from "supertest";
import app from "../../app";
import {
  CURRENT_USER_ENDPOINT,
  SIGNUP_ENDPOINT,
} from "../../resources/helpers";

const email = "admin@admin.com";
const password = "123456";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get(CURRENT_USER_ENDPOINT)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual(email);
});

it("responds with null if no current user", async () => {
  const response = await request(app)
    .get(CURRENT_USER_ENDPOINT)
    .send({})
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

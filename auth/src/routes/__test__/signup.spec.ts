import request from "supertest";
import app from "../../app";
import { SIGNUP_ENDPOINT } from "../../resources/helpers";

it("Returns a 201 on successful signup", async () => {
  return request(app)
    .post(SIGNUP_ENDPOINT)
    .send({
      email: "admin@admin.com",
      password: "123456",
    })
    .expect(201);
});

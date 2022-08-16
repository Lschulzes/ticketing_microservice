import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
declare global {
  var signin: () => Promise<Array<string>>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "sdjfljsfd";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// global.signin = async () => {
//   const email = "admin@admin.com";
//   const password = "123456";

//   const response = await request(app)
//     .post(SIGNUP_ENDPOINT)
//     .send({ email, password })
//     .expect(201);

//   return response.get("Set-Cookie");
// };

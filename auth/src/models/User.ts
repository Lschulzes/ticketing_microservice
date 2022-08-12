import mongoose, { Schema } from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "../interfaces/user";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = mongoose.model<UserDoc, UserModel>(
  "User",
  UserSchema,
  "users"
);

export default User;

import mongoose, { Schema } from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "../interfaces/user";
import { Passwod } from "../services/password";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await Passwod.toHash(this.password);
    this.set("password", hashedPassword);
  }

  next();
});

export const User = mongoose.model<UserDoc, UserModel>(
  "User",
  UserSchema,
  "users"
);

export default User;

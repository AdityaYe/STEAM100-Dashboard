import mongoose, {
  Schema,
  Document,
} from "mongoose";

import bcrypt from "bcryptjs";

export interface IUser
  extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;

  comparePassword: (
    enteredPassword: string
  ) => Promise<boolean>;
}

const userSchema =
  new Schema<IUser>(
    {
      username: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      password: {
        type: String,
      },

      googleId: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

userSchema.pre(
  "save",
  async function () {
    if (!this.password) return;
    if (!this.isModified("password"))
      return;

    this.password =
      await bcrypt.hash(
        this.password,
        10
      );
  }
);

userSchema.methods.comparePassword =
  function (
    enteredPassword: string
  ) {
    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

export const User =
  mongoose.model<IUser>(
    "User",
    userSchema
  );
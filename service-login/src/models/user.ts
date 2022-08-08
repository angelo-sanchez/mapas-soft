import { model, Schema, Document } from "mongoose";

const bcrypt = require("bcryptjs")

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<Boolean>
};

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = function(password: string): Promise<Boolean> {
  return bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);

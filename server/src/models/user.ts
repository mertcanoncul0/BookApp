import { model, Schema } from "mongoose"

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "author"],
    default: "user",
  },
})

const UserModel = model("User", userSchema)

export const findUserByEmail = async (email: string) =>
  await UserModel.findOne({ email })

export const createUser = async (email: string) =>
  await UserModel.create({ email })

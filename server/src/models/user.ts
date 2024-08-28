import { model, Schema, Types } from "mongoose"

export interface UserDoc {
  _id: Types.ObjectId
  email: string
  role: "user" | "author"
  name?: string
  signedUp: boolean
  avatar?: {
    url: string
    id: string
  }
}

const userSchema = new Schema<UserDoc>({
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
  signedUp: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: Object,
    url: String,
    id: String,
  },
})

const UserModel = model("User", userSchema)

export const findUserByEmail = async (email: string) =>
  await UserModel.findOne({ email })

export const createUser = async (email: string) =>
  await UserModel.create({ email })

export const findUserById = async (id: Types.ObjectId) =>
  await UserModel.findById(id)

export const findByIdAndUpdateName = async (id: Types.ObjectId, name: string) =>
  await UserModel.findByIdAndUpdate(id, { name, signedUp: true }, { new: true })

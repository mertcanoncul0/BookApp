import { Model, model, ObjectId, Schema } from "mongoose"

export interface UserDoc {
  _id: string
  email: string
  role: "user" | "author"
  name?: string
  signedUp: boolean
  avatar?: {
    url: string
    id: string
  }
  authorId?: string
  books: ObjectId[]
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
  authorId: {
    type: String,
    ref: "Author",
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
})

const UserModel = model("User", userSchema)
export default UserModel as Model<UserDoc>

export const findUserByEmail = async (email: string) =>
  await UserModel.findOne({ email })

export const createUser = async (email: string) =>
  await UserModel.create({ email })

export const findUserById = async (id: string) => await UserModel.findById(id)

export const findByIdAndUpdateName = async (id: string, name: string) =>
  await UserModel.findByIdAndUpdate(id, { name, signedUp: true }, { new: true })

export const findByIdAndUpdateRole = async (id: string, authorId: string) =>
  await UserModel.findByIdAndUpdate(id, { authorId, role: "author" })

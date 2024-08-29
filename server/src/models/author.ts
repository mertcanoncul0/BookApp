import { Request } from "express"
import { model, Schema, Types } from "mongoose"

interface AuthorDoc {
  userId: Types.ObjectId
  name: string
  about: string
  slug?: string
  socialLinks?: string[]
  books?: Types.ObjectId[]
}

const authorSchema = new Schema<AuthorDoc>(
  {
    userId: {
      type: "ObjectId",
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    socialLinks: [String],
    books: [
      {
        type: Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const AuthorModel = model("Author", authorSchema)

export const createAuthor = async (author: AuthorDoc) => new AuthorModel(author)
export const findAuthorBySlug = async (slug: string) =>
  await AuthorModel.findOne({ slug })

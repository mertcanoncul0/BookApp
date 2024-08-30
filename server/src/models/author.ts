import { Request } from "express"
import { model, Schema, Types } from "mongoose"

interface AuthorDoc {
  userId: string
  name: string
  about: string
  slug?: string
  socialLinks?: string[]
  books?: string[]
}

const authorSchema = new Schema<AuthorDoc>(
  {
    userId: {
      type: String,
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
        type: String,
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

export const findByIdBookAndPush = async (id: string, bookId: Types.ObjectId) =>
  await AuthorModel.findByIdAndUpdate(id, { $push: { books: bookId } })

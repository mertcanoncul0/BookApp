import { uploadBookToLocalDir, uploadCoverToCloudinary } from "@/lib/fileUpload"
import { formatFileSize, sendErrorResponse } from "@/lib/helper"
import { createBook } from "@/models/book"
import { CreateBookRequestHandler } from "@/types"
import { Types } from "mongoose"
import path, { dirname } from "path"
import fs from "fs"
import slugify from "slugify"
import { findByIdBookAndPush } from "@/models/author"

export const createNewBook: CreateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req
  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
  } = body

  const { cover, book } = files

  const newBook = await createBook({
    title,
    description,
    genre,
    language,
    fileInfo: {
      size: formatFileSize(fileInfo.size),
      id: "",
    },
    price,
    publicationName,
    publishedAt,
    slug: "",
    author: new Types.ObjectId(user.authorId),
  })

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  })

  if (cover && !Array.isArray(cover)) {
    newBook.cover = await uploadCoverToCloudinary(cover)
  }

  if (
    !book ||
    Array.isArray(book) ||
    book.mimetype !== "application/epub+zip"
  ) {
    return sendErrorResponse({
      res,
      status: 422,
      message: "Book file is required!",
    })
  }

  const bookStoragePath = path.join(__dirname, "../public/books")

  if (!fs.existsSync(bookStoragePath)) {
    fs.mkdirSync(bookStoragePath)
  }

  const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  })

  const filePath = path.join(bookStoragePath, uniqueFileName)

  fs.writeFileSync(filePath, fs.readFileSync(book.filepath))

  uploadBookToLocalDir(book, uniqueFileName)
  newBook.fileInfo.id = uniqueFileName

  if (user.authorId) {
    await findByIdBookAndPush(user.authorId, newBook._id)
  }

  await newBook.save()

  res.json({ message: "Book created successfully!" })
}

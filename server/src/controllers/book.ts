import { uploadBookToLocalDir, uploadCoverToCloudinary } from "@/lib/fileUpload"
import { formatFileSize, sendErrorResponse } from "@/lib/helper"
import BookModel, { createBook, findBookByAuthor } from "@/models/book"
import { CreateBookRequestHandler, UpdateBookRequestHandler } from "@/types"
import { Types } from "mongoose"
import path from "path"
import fs from "fs"
import slugify from "slugify"
import { findByIdBookAndPush } from "@/models/author"
import cloudinary from "@/cloud/cloudinary"
import { RequestHandler } from "express"
import UserModel from "@/models/user"

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
    author: user.authorId as string,
  })

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  })

  if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
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

export const updateBook: UpdateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req
  const {
    title,
    description,
    genre,
    language,
    price,
    publicationName,
    publishedAt,
    slug,
    fileInfo,
  } = body

  const { cover, book: newBookFile } = files

  const book = await findBookByAuthor(user.authorId as string, slug)

  if (!book) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Book not found!",
    })
  }

  book.title = title
  book.description = description
  book.genre = genre
  book.language = language
  book.price = price
  book.publicationName = publicationName
  book.publishedAt = publishedAt

  if (
    newBookFile &&
    !Array.isArray(newBookFile) &&
    newBookFile.mimetype === "application/epub+zip"
  ) {
    const uploadPath = path.join(__dirname, "../public/books")
    const oldFilePath = path.join(uploadPath, book.fileInfo.id)

    if (!fs.existsSync(oldFilePath))
      return sendErrorResponse({
        res,
        status: 404,
        message: "Book file not found!",
      })

    fs.unlinkSync(oldFilePath)

    const newFileName = slugify(`${book._id} ${book.title}.epub`, {
      lower: true,
      replacement: "-",
    })

    const newFilePath = path.join(uploadPath, newFileName)
    const file = fs.readFileSync(newBookFile.filepath)
    fs.writeFileSync(newFilePath, file)

    book.fileInfo = {
      id: newFileName,
      size: formatFileSize(fileInfo?.size || newBookFile.size),
    }
  }

  if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
    if (book.cover?.id) {
      await cloudinary.uploader.destroy(book.cover.id)
    }

    book.cover = await uploadCoverToCloudinary(cover)
  }

  await book.save()

  res.json({ message: "Book updated successfully!" })
}

interface PopulatedBooks {
  cover: {
    url: string
    id: string
  }
  _id: string
  author: {
    _id: string
    name: string
    slug: string
  }
  title: string
  slug: string
}

export const getAllPurchasedBooks: RequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate<{
    books: PopulatedBooks[]
  }>({
    path: "books",
    select: "author title cover slug",
    populate: { path: "author", select: "slug name" },
  })

  if (!user) return res.json({ books: [] })
  console.log(user)

  res.json({
    books: user.books.map((book) => ({
      id: book._id,
      title: book.title,
      cover: book?.cover?.url,
      slug: book.slug,
      author: {
        name: book.author.name,
        slug: book.author.slug,
      },
    })),
  })
}

export const getBookPublicDetails: RequestHandler = async (req, res) => {
  const book = await BookModel.findOne({ slug: req.params.slug }).populate<{
    author: PopulatedBooks["author"]
  }>({
    path: "author",
    select: "name slug",
  })

  if (!book)
    return sendErrorResponse({ res, status: 404, message: "Book not found!" })

  const {
    _id,
    title,
    cover,
    author,
    slug,
    description,
    genre,
    language,
    publishedAt,
    publicationName,
    avarageRating,
    price: { mrp, sale },
    fileInfo,
  } = book

  res.json({
    book: {
      id: _id,
      title,
      genre,
      language,
      slug,
      description,
      rating: avarageRating?.toFixed(2),
      publicationName,
      fileInfo,
      publishedAt: publishedAt.toISOString(),
      cover: cover?.url,
      price: {
        mrp: (mrp / 100).toFixed(2),
        sale: (sale / 100).toFixed(2),
      },
      author: {
        id: author._id,
        name: author.name,
        slug: author.slug,
      },
    },
  })
}

import { createNewBook, updateBook } from "@/controllers/book"
import { isAuth, isAuthor } from "@/middlewares/auth"
import { fileParser } from "@/middlewares/file"
import { newBookSchema, updateBookSchema } from "@/types/schema"
import { validate } from "@/middlewares/validate"

import express from "express"

export default (router: express.Router) => {
  router.post(
    "/book/create",
    isAuth,
    isAuthor,
    fileParser,
    validate(newBookSchema),
    createNewBook
  )

  router.patch(
    "/book",
    isAuth,
    isAuthor,
    fileParser,
    validate(updateBookSchema),
    updateBook
  )
}

import { createNewBook } from "@/controllers/book"
import { isAuth, isAuthor } from "@/middlewares/auth"
import { fileParser } from "@/middlewares/file"
import { newBookSchema, validate } from "@/middlewares/validate"
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
}

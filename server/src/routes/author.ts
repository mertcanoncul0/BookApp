import { getAuthorDetail, registerAuthor } from "@/controllers/authors"
import { isAuth } from "@/middlewares/auth"
import { newAuthorSchema, validate } from "@/middlewares/validate"
import express from "express"

export default (router: express.Router) => {
  router.post(
    "/author/register",
    isAuth,
    validate(newAuthorSchema),
    registerAuthor
  )
  router.get("/author/:slug", getAuthorDetail)
}

import express from "express"
import auth from "@/routes/auth"
import author from "./author"
import book from "./book"

const router = express.Router()

export default (): express.Router => {
  auth(router)
  author(router)
  book(router)

  return router
}

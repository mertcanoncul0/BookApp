import express from "express"
import auth from "@/routes/auth"
import author from "./author"
import book from "./book"
import review from "./review"
import history from "./history"

const router = express.Router()

export default (): express.Router => {
  auth(router)
  author(router)
  book(router)
  review(router)
  history(router)

  return router
}

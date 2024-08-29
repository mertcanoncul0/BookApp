import express from "express"
import auth from "@/routes/auth"
import author from "./author"

const router = express.Router()

export default (): express.Router => {
  auth(router)
  author(router)

  return router
}

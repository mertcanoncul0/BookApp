import { getBookHistory, updateBookHistory } from "@/controllers/history"
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth"
import { validate } from "@/middlewares/validate"
import { historyValidationSchema } from "@/types/schema"
import express from "express"

export default (router: express.Router) => {
  router.post(
    "/history",
    isAuth,
    validate(historyValidationSchema),
    isPurchasedByTheUser,
    updateBookHistory
  )

  router.get("/history/:bookId", isAuth, getBookHistory)
}

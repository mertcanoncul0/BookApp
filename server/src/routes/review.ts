import { addReview, getReview } from "@/controllers/review"
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth"
import { validate } from "@/middlewares/validate"
import { newReviewSchema } from "@/types/schema"
import express from "express"

export default (router: express.Router) => {
  router.post(
    "/review/add",
    isAuth,
    validate(newReviewSchema),
    isPurchasedByTheUser,
    addReview
  )

  router.get("/review/:bookId", isAuth, getReview)
}

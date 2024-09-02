import { sendErrorResponse } from "@/lib/helper"
import BookModel from "@/models/book"
import ReviewModel from "@/models/review"
import { AddReviewRequestHandler } from "@/types"
import { RequestHandler } from "express"
import { isValidObjectId, Types } from "mongoose"

export const addReview: AddReviewRequestHandler = async (req, res) => {
  const { bookId, rating, content } = req.body

  await ReviewModel.findOneAndUpdate(
    { book: bookId, user: req.user.id },
    { content, rating },
    { upsert: true }
  )

  const [result] = await ReviewModel.aggregate<{ avarageRating: number }>([
    {
      $match: {
        book: new Types.ObjectId(bookId),
      },
    },
    {
      $group: {
        _id: null,
        avarageRating: { $avg: "$rating" },
      },
    },
  ])

  await BookModel.findByIdAndUpdate(bookId, {
    avarageRating: result.avarageRating,
  })

  res.json({ message: "review updated" })
}

export const getReview: RequestHandler = async (req, res) => {
  const { bookId } = req.params

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Invalid book id!",
    })
  }

  const review = await ReviewModel.findOne({ book: bookId, user: req.user.id })
  if (!review) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Review not found!",
    })
  }

  res.json({ content: review?.content, rating: review?.rating })
}

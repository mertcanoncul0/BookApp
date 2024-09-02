import { Model, model, ObjectId, Schema } from "mongoose"

interface ReviewDoc {
  user: ObjectId
  book: ObjectId
  rating: number
  content?: string
}

const reviewSchema = new Schema<ReviewDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

const ReviewModel = model("Review", reviewSchema)

export default ReviewModel as Model<ReviewDoc>

import {
  historyValidationSchema,
  newAuthorSchema,
  newBookSchema,
  newReviewSchema,
  updateBookSchema,
} from "@/types/schema"
import { RequestHandler } from "express"
import { z } from "zod"

type AuthorHandleBody = z.infer<typeof newAuthorSchema>
type NewBookBody = z.infer<typeof newBookSchema>
type UpdateBookBody = z.infer<typeof updateBookSchema>
type AddReviewBody = z.infer<typeof newReviewSchema>
type HistoryBookBody = z.infer<typeof historyValidationSchema>

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandleBody>
export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>
export type UpdateBookRequestHandler = RequestHandler<{}, {}, UpdateBookBody>
export type AddReviewRequestHandler = RequestHandler<{}, {}, AddReviewBody>
export type UpdatedHistoryRequestHandler = RequestHandler<
  {},
  {},
  HistoryBookBody
>

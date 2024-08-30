import {
  newAuthorSchema,
  newBookSchema,
  updateBookSchema,
} from "@/middlewares/validate"
import { RequestHandler } from "express"
import { z } from "zod"

type AuthorHandleBody = z.infer<typeof newAuthorSchema>
type NewBookBody = z.infer<typeof newBookSchema>
type UpdateBookBody = z.infer<typeof updateBookSchema>

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandleBody>
export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>
export type UpdateBookRequestHandler = RequestHandler<{}, {}, UpdateBookBody>

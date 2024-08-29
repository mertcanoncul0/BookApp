import { newAuthorSchema, newBookSchema } from "@/middlewares/validate"
import { RequestHandler } from "express"
import { z } from "zod"

type AuthorHandleBody = z.infer<typeof newAuthorSchema>
type NewBookBody = z.infer<typeof newBookSchema>

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandleBody>
export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>

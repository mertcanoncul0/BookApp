import { newAuthorSchema } from "@/middlewares/validate"
import { RequestHandler } from "express"
import { z } from "zod"

type AuthorHandleBody = z.infer<typeof newAuthorSchema>
export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandleBody>

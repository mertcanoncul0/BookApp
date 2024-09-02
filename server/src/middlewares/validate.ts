import { RequestHandler } from "express"
import { ZodObject, ZodRawShape } from "zod"

export const validate = <T extends ZodRawShape>(
  schema: ZodObject<T>
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return res.status(422).json({ errors })
    }

    req.body = result.data
    next()
  }
}

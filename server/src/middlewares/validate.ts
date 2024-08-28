import { RequestHandler } from "express"
import { z, ZodRawShape } from "zod"

export const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Email is invalid!"),
}

export const newUserSchema = {
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
}

export const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
  return (req, res, next) => {
    const schema = z.object(obj)
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return res.status(422).json({ errors })
    }

    req.body = result.data
    next()
  }
}

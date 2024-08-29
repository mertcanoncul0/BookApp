import { RequestHandler } from "express"
import { z, ZodType } from "zod"

export const emailValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Email is invalid!"),
})

export const newUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
})

export const newAuthorSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
  about: z
    .string({
      required_error: "About is missing!",
      invalid_type_error: "Invalid about!",
    })
    .min(100, "About must be 100 characters long!")
    .trim(),
  socialLinks: z
    .array(z.string().url("social links can only be list of urls"))
    .optional(),
})

export const validate = <T extends unknown>(
  schema: ZodType<T>
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

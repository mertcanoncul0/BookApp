import { isValidObjectId } from "mongoose"
import { z } from "zod"

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

const commonBookSchema = {
  title: z
    .string({
      required_error: "Title is missing!",
      invalid_type_error: "Invalid title!",
    })
    .trim(),
  slug: z.string().trim().optional(),
  description: z
    .string({
      required_error: "Description is missing!",
      invalid_type_error: "Invalid description!",
    })
    .trim(),
  language: z
    .string({
      required_error: "Language is missing!",
      invalid_type_error: "Invalid language!",
    })
    .trim(),
  publishedAt: z.coerce.date({
    required_error: "Published date is missing!",
    invalid_type_error: "Invalid published date!",
  }),
  publicationName: z
    .string({
      required_error: "Publication name is missing!",
      invalid_type_error: "Invalid publication name!",
    })
    .trim(),
  genre: z
    .string({
      required_error: "Genre is missing!",
      invalid_type_error: "Invalid genre!",
    })
    .trim(),
  price: z
    .string({
      required_error: "Price is missing!",
      invalid_type_error: "Invalid price!",
    })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val)
      } catch (error) {
        ctx.addIssue({ code: "custom", message: "Invalid price Data!" })
        return z.NEVER
      }
    })
    .pipe(
      z
        .object({
          mrp: z
            .number({
              required_error: "MRP is missing!",
              invalid_type_error: "Invalid mrp!",
            })
            .nonnegative("Invalid mrp!"),
          sale: z
            .number({
              required_error: "Sale is missing!",
              invalid_type_error: "Invalid sale!",
            })
            .nonnegative("Invalid sale price!"),
        })
        .refine(
          (price) => price.sale <= price.mrp,
          "Sale price must be less than MRP!"
        )
    ),
}

const fileInfo = z
  .string({
    required_error: "File info is missing!",
    invalid_type_error: "Invalid file info!",
  })
  .transform((val, ctx) => {
    try {
      return JSON.parse(val)
    } catch (error) {
      ctx.addIssue({ code: "custom", message: "Invalid File Info!" })
      return z.NEVER
    }
  })
  .pipe(
    z.object({
      name: z
        .string({
          required_error: "fileInfo.name is missing!",
          invalid_type_error: "Invalid fileInfo.name!",
        })
        .trim(),
      type: z
        .string({
          required_error: "fileInfo.type is missing!",
          invalid_type_error: "Invalid fileInfo.type!",
        })
        .trim(),
      size: z
        .number({
          required_error: "fileInfo.size is missing!",
          invalid_type_error: "Invalid fileInfo.size!",
        })
        .nonnegative("Invalid fileInfo.size!"),
    })
  )

export const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo,
})

export const updateBookSchema = z.object({
  ...commonBookSchema,
  slug: z
    .string({
      message: "Slug is missing!",
    })
    .trim(),
  fileInfo: fileInfo.optional(),
})

export const newReviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is missing!",
      invalid_type_error: "Invalid rating!",
    })
    .nonnegative("Rating must be within 1 to 5!")
    .min(1, "Rating must be within 1 to 5!")
    .max(5, "Rating must be within 1 to 5!"),
  content: z
    .string({
      invalid_type_error: "Invalid content!",
    })
    .optional(),
  bookId: z
    .string({
      required_error: "Book ID is missing!",
      invalid_type_error: "Invalid book ID!",
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book ID!" })
        return z.NEVER
      }

      return arg
    }),
})

export const historyValidationSchema = z.object({
  bookId: z
    .string({
      required_error: "Book ID is missing!",
      invalid_type_error: "Invalid book ID!",
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book ID!" })
        return z.NEVER
      }

      return arg
    }),
  lastLocation: z
    .string({
      invalid_type_error: "Invalid last location!",
    })
    .trim()
    .optional(),
  highlights: z
    .array(
      z.object({
        selection: z
          .string({
            required_error: "Selection is missing!",
            invalid_type_error: "Invalid selection!",
          })
          .trim(),
        fill: z
          .string({
            required_error: "Fill is missing!",
            invalid_type_error: "Invalid fill!",
          })
          .trim(),
      })
    )
    .optional(),
  remove: z
    .boolean({
      required_error: "Remove is missing!",
      invalid_type_error: "Invalid remove!",
    })
    .optional(),
})
